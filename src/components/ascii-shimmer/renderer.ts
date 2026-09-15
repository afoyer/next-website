// Fullscreen ASCII "shimmer": a glyph grid lit by slow-drifting noise plus a
// glow that follows the pointer, with fast flicker inside the glow. Draws with
// premultiplied alpha onto a transparent canvas so it layers over any background.

const CELL_PX = 11; // on-screen character cell size in CSS px
const MAX_DPR = 2;
const GLYPH_RAMP = " .:-=+*#%@"; // density-ordered, index 0 = empty
const GLYPH_SIZE = 64; // atlas cell size in px
const POINTER_LERP = 0.07; // per-frame smoothing toward the pointer target
const GLOW_RADIUS_CSS = 300; // px, glow falloff radius
const INTENSITY = 0.6; // max ink alpha so overlaid text stays readable

const VERT = `#version 300 es
void main() {
	vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uResolution; // device px
uniform float uCell; // device px
uniform float uTime; // seconds
uniform vec2 uPointer; // device px, y-up
uniform float uRadius; // device px
uniform vec3 uFg;
uniform float uGlyphCount;
uniform float uIntensity;

out vec4 outColor;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float vnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
	float v = 0.0;
	float amp = 0.5;
	for (int i = 0; i < 3; i++) {
		v += amp * vnoise(p);
		p *= 2.03;
		amp *= 0.5;
	}
	return v;
}

void main() {
	vec2 cell = floor(gl_FragCoord.xy / uCell);
	vec2 center = (cell + 0.5) * uCell;

	// glow around the pointer
	float d = distance(center, uPointer) / uRadius;
	float glow = exp(-d * d * 2.2);

	// slow-drifting field in cell units, plus a fast per-cell flicker
	float field = fbm(cell * 0.09 + vec2(uTime * 0.06, -uTime * 0.045));
	float flicker = hash(cell + floor(uTime * 9.0));

	float ambient = 0.14 * smoothstep(0.35, 0.9, field);
	float v = ambient + glow * (0.35 + 0.65 * field) * (0.6 + 0.4 * flicker);
	v = clamp(v, 0.0, 1.0);

	float idx = floor(v * (uGlyphCount - 1.0) + 0.5);
	vec2 inCell = fract(gl_FragCoord.xy / uCell);
	float a = texture(uAtlas, vec2((idx + inCell.x) / uGlyphCount, 1.0 - inCell.y)).a;

	float alpha = a * v * uIntensity;
	outColor = vec4(uFg * alpha, alpha);
}`;

type Rgb = [number, number, number];

const UNIFORM_NAMES = [
	"uAtlas",
	"uResolution",
	"uCell",
	"uTime",
	"uPointer",
	"uRadius",
	"uFg",
	"uGlyphCount",
	"uIntensity",
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("shader allocation failed");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`shader compile failed: ${log}`);
	}
	return shader;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
	const program = gl.createProgram();
	if (!program) throw new Error("program allocation failed");
	gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT));
	gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`program link failed: ${gl.getProgramInfoLog(program)}`);
	}
	return program;
}

function createGlyphAtlas(gl: WebGL2RenderingContext): WebGLTexture {
	const canvas = document.createElement("canvas");
	canvas.width = GLYPH_SIZE * GLYPH_RAMP.length;
	canvas.height = GLYPH_SIZE;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("2d context unavailable");
	ctx.fillStyle = "#fff";
	ctx.font = `${Math.round(GLYPH_SIZE * 0.8)}px "Courier New", monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	for (let i = 0; i < GLYPH_RAMP.length; i++) {
		ctx.fillText(GLYPH_RAMP[i], i * GLYPH_SIZE + GLYPH_SIZE / 2, GLYPH_SIZE / 2);
	}
	const tex = gl.createTexture();
	if (!tex) throw new Error("texture allocation failed");
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return tex;
}

function parseHex(hex: string): Rgb {
	const h = hex.replace("#", "");
	const full =
		h.length === 3
			? h
					.split("")
					.map((c) => c + c)
					.join("")
			: h;
	const rgb: Rgb = [
		Number.parseInt(full.slice(0, 2), 16) / 255,
		Number.parseInt(full.slice(2, 4), 16) / 255,
		Number.parseInt(full.slice(4, 6), 16) / 255,
	];
	return rgb.some(Number.isNaN) ? [0.5, 0.5, 0.5] : rgb;
}

export class AsciiShimmerRenderer {
	private gl: WebGL2RenderingContext;
	private canvas: HTMLCanvasElement;
	private program: WebGLProgram;
	private uniforms: Record<UniformName, WebGLUniformLocation | null>;
	private atlas: WebGLTexture;
	private dpr = 1;
	private cssWidth = 0;
	private cssHeight = 0;
	private fg: Rgb = [1, 1, 1];
	private target = { x: 0, y: 0 }; // CSS px, y-down
	private pointer = { x: 0, y: 0 }; // smoothed
	private hasPointerTarget = false;
	private animated = true;
	private rafId = 0;
	private startTime = 0;
	private destroyed = false;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const gl = canvas.getContext("webgl2", {
			antialias: false,
			depth: false,
			stencil: false,
			alpha: true,
			premultipliedAlpha: true,
			powerPreference: "low-power",
		});
		if (!gl) throw new Error("webgl2 unavailable");
		this.gl = gl;
		this.program = createProgram(gl);
		this.atlas = createGlyphAtlas(gl);
		this.uniforms = Object.fromEntries(
			UNIFORM_NAMES.map((name) => [name, gl.getUniformLocation(this.program, name)]),
		) as Record<UniformName, WebGLUniformLocation | null>;
	}

	resize(cssWidth: number, cssHeight: number): void {
		this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
		this.cssWidth = cssWidth;
		this.cssHeight = cssHeight;
		this.canvas.width = Math.round(cssWidth * this.dpr);
		this.canvas.height = Math.round(cssHeight * this.dpr);
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		if (!this.hasPointerTarget) {
			this.target = { x: cssWidth / 2, y: cssHeight / 2 };
			this.pointer = { ...this.target };
		}
	}

	setTheme(fgHex: string): void {
		this.fg = parseHex(fgHex);
	}

	/** Pointer position in CSS px from the viewport's top-left. */
	setPointer(cssX: number, cssY: number): void {
		this.hasPointerTarget = true;
		this.target = { x: cssX, y: cssY };
	}

	/** false freezes the noise field (reduced motion); the glow still follows the pointer. */
	setAnimated(animated: boolean): void {
		this.animated = animated;
	}

	start(): void {
		this.startTime = performance.now();
		const tick = (now: number) => {
			if (this.destroyed) return;
			this.step(now);
			this.rafId = requestAnimationFrame(tick);
		};
		this.rafId = requestAnimationFrame(tick);
	}

	destroy(): void {
		this.destroyed = true;
		cancelAnimationFrame(this.rafId);
		this.gl.deleteTexture(this.atlas);
		this.gl.deleteProgram(this.program);
	}

	private step(now: number): void {
		const t = (now - this.startTime) / 1000;

		// no pointer yet (touch devices): let the glow wander slowly
		if (!this.hasPointerTarget && this.cssWidth) {
			this.target = {
				x: this.cssWidth * (0.5 + 0.3 * Math.sin(t * 0.31)),
				y: this.cssHeight * (0.5 + 0.28 * Math.cos(t * 0.23)),
			};
		}
		this.pointer.x += (this.target.x - this.pointer.x) * POINTER_LERP;
		this.pointer.y += (this.target.y - this.pointer.y) * POINTER_LERP;

		this.render(this.animated ? t : 0);
	}

	private render(time: number): void {
		const gl = this.gl;
		const u = this.uniforms;
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL method, not a React hook
		gl.useProgram(this.program);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.atlas);
		gl.uniform1i(u.uAtlas, 0);
		gl.uniform2f(u.uResolution, this.canvas.width, this.canvas.height);
		gl.uniform1f(u.uCell, CELL_PX * this.dpr);
		gl.uniform1f(u.uTime, time);
		gl.uniform2f(
			u.uPointer,
			this.pointer.x * this.dpr,
			this.canvas.height - this.pointer.y * this.dpr,
		);
		gl.uniform1f(u.uRadius, GLOW_RADIUS_CSS * this.dpr);
		gl.uniform3fv(u.uFg, this.fg);
		gl.uniform1f(u.uGlyphCount, GLYPH_RAMP.length);
		gl.uniform1f(u.uIntensity, INTENSITY);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}
