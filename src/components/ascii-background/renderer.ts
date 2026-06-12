const CELL_PX = 12; // on-screen character cell size in CSS px
const MAX_DPR = 2;
const FADE_MS = 400;
const GLYPH_RAMP = " .:-=+*#%@";
const GLYPH_SIZE = 64; // atlas cell size in px
const GLYPH_INTENSITY = 0.85; // max fg mix so overlaid UI stays readable

const VERT = `#version 300 es
void main() {
	vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uImageA; // current
uniform sampler2D uImageB; // previous (during crossfade)
uniform sampler2D uAtlas;
uniform float uMix; // 0 = previous, 1 = current
uniform vec2 uResolution; // canvas device px
uniform float uCell; // cell size in device px
uniform vec3 uFg;
uniform vec3 uBg;
uniform float uGlyphCount;
uniform vec2 uSizeA;
uniform vec2 uSizeB;

out vec4 outColor;

float luma(vec3 c) {
	return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

vec2 coverUv(vec2 uv, vec2 imgSize) {
	float sa = uResolution.x / uResolution.y;
	float ia = imgSize.x / imgSize.y;
	vec2 scale = sa > ia ? vec2(1.0, ia / sa) : vec2(sa / ia, 1.0);
	return (uv - 0.5) * scale + 0.5;
}

float sampleLuma(sampler2D img, vec2 uv, vec2 imgSize) {
	// pick the mip whose texel density matches one cell, so each cell
	// reads a stable local average instead of a noisy point sample
	float texelsPerCell = imgSize.y * uCell / uResolution.y;
	float lod = max(log2(texelsPerCell), 0.0);
	return luma(textureLod(img, uv, lod).rgb);
}

void main() {
	vec2 cell = floor(gl_FragCoord.xy / uCell);
	vec2 center = (cell + 0.5) * uCell;
	vec2 uv = vec2(center.x / uResolution.x, 1.0 - center.y / uResolution.y);

	float lA = sampleLuma(uImageA, coverUv(uv, uSizeA), uSizeA);
	float lB = sampleLuma(uImageB, coverUv(uv, uSizeB), uSizeB);
	float l = mix(lB, lA, uMix);

	float glyph = floor(clamp(l, 0.0, 0.999) * uGlyphCount);
	vec2 inCell = fract(gl_FragCoord.xy / uCell);
	vec2 atlasUv = vec2((glyph + inCell.x) / uGlyphCount, 1.0 - inCell.y);
	float a = texture(uAtlas, atlasUv).a;

	outColor = vec4(mix(uBg, uFg, a * ${GLYPH_INTENSITY.toFixed(2)}), 1.0);
}`;

type GlTexture = { tex: WebGLTexture; width: number; height: number };
type Rgb = [number, number, number];

const UNIFORM_NAMES = [
	"uImageA",
	"uImageB",
	"uAtlas",
	"uMix",
	"uResolution",
	"uCell",
	"uFg",
	"uBg",
	"uGlyphCount",
	"uSizeA",
	"uSizeB",
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

export class AsciiRenderer {
	private gl: WebGL2RenderingContext;
	private canvas: HTMLCanvasElement;
	private program: WebGLProgram;
	private uniforms: Record<UniformName, WebGLUniformLocation | null>;
	private atlas: WebGLTexture;
	private textures = new Map<string, GlTexture>();
	private current: GlTexture | null = null;
	private previous: GlTexture | null = null;
	private mix = 1;
	private dpr = 1;
	private fg: Rgb = [1, 1, 1];
	private bg: Rgb = [0, 0, 0];
	private rafId = 0;
	private pendingSrc: string | null = null;
	private destroyed = false;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const gl = canvas.getContext("webgl2", {
			antialias: false,
			depth: false,
			stencil: false,
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
		this.canvas.width = Math.round(cssWidth * this.dpr);
		this.canvas.height = Math.round(cssHeight * this.dpr);
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.render();
	}

	setTheme(fgHex: string, bgHex: string): void {
		this.fg = parseHex(fgHex);
		this.bg = parseHex(bgHex);
		this.render();
	}

	async show(src: string, animate: boolean): Promise<void> {
		this.pendingSrc = src;
		const next = await this.loadTexture(src);
		// a newer show() call won the race while we were loading
		if (this.destroyed || this.pendingSrc !== src || next === this.current) return;
		if (!this.current || !animate) {
			this.current = next;
			this.previous = null;
			this.mix = 1;
			this.render();
			return;
		}
		this.previous = this.current;
		this.current = next;
		this.startFade();
	}

	destroy(): void {
		this.destroyed = true;
		cancelAnimationFrame(this.rafId);
		for (const { tex } of this.textures.values()) this.gl.deleteTexture(tex);
		this.textures.clear();
		this.gl.deleteTexture(this.atlas);
		this.gl.deleteProgram(this.program);
	}

	private async loadTexture(src: string): Promise<GlTexture> {
		const cached = this.textures.get(src);
		if (cached) return cached;
		const img = new Image();
		img.src = src;
		await img.decode();
		if (!img.naturalWidth || !img.naturalHeight) throw new Error(`empty image: ${src}`);
		const gl = this.gl;
		const tex = gl.createTexture();
		if (!tex) throw new Error("texture allocation failed");
		try {
			gl.bindTexture(gl.TEXTURE_2D, tex);
			// animated gifs upload their first frame only — fine per spec
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		} catch (err) {
			gl.deleteTexture(tex);
			throw err;
		}
		const entry = { tex, width: img.naturalWidth, height: img.naturalHeight };
		this.textures.set(src, entry);
		return entry;
	}

	private startFade(): void {
		cancelAnimationFrame(this.rafId);
		const start = performance.now();
		const tick = (now: number) => {
			const t = Math.min((now - start) / FADE_MS, 1);
			this.mix = t * t * (3 - 2 * t);
			this.render();
			if (t < 1) {
				this.rafId = requestAnimationFrame(tick);
			} else {
				this.previous = null;
			}
		};
		this.rafId = requestAnimationFrame(tick);
	}

	private render(): void {
		const gl = this.gl;
		if (!this.current) {
			gl.clearColor(this.bg[0], this.bg[1], this.bg[2], 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			return;
		}
		const prev = this.previous ?? this.current;
		const u = this.uniforms;
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL method, not a React hook
		gl.useProgram(this.program);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.current.tex);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, prev.tex);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.atlas);
		gl.uniform1i(u.uImageA, 0);
		gl.uniform1i(u.uImageB, 1);
		gl.uniform1i(u.uAtlas, 2);
		gl.uniform1f(u.uMix, this.previous ? this.mix : 1);
		gl.uniform2f(u.uResolution, this.canvas.width, this.canvas.height);
		gl.uniform1f(u.uCell, CELL_PX * this.dpr);
		gl.uniform3fv(u.uFg, this.fg);
		gl.uniform3fv(u.uBg, this.bg);
		gl.uniform1f(u.uGlyphCount, GLYPH_RAMP.length);
		gl.uniform2f(u.uSizeA, this.current.width, this.current.height);
		gl.uniform2f(u.uSizeB, prev.width, prev.height);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}
