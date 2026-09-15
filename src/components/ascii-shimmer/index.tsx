"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AsciiShimmerRenderer } from "./renderer";

const RESIZE_DEBOUNCE_MS = 150;

// Viewport-filling ASCII shimmer that follows the pointer. Transparent canvas,
// ink color from the theme's --foreground. Renders nothing if WebGL2 is missing.
export function AsciiShimmer({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (failed) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		let renderer: AsciiShimmerRenderer;
		try {
			renderer = new AsciiShimmerRenderer(canvas);
		} catch {
			setFailed(true);
			return;
		}

		const applySize = () => renderer.resize(window.innerWidth, window.innerHeight);
		applySize();

		let resizeTimer: ReturnType<typeof setTimeout> | undefined;
		const onResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(applySize, RESIZE_DEBOUNCE_MS);
		};
		window.addEventListener("resize", onResize);

		const readTheme = () => {
			const style = getComputedStyle(document.documentElement);
			renderer.setTheme(style.getPropertyValue("--foreground").trim());
		};
		readTheme();
		const themeObserver = new MutationObserver(readTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const applyMotion = () => renderer.setAnimated(!reduced.matches);
		applyMotion();
		reduced.addEventListener("change", applyMotion);

		// only fine pointers drive the glow; touch devices get the ambient drift
		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType === "mouse" || e.pointerType === "pen") {
				renderer.setPointer(e.clientX, e.clientY);
			}
		};
		window.addEventListener("pointermove", onPointerMove, { passive: true });

		const onContextLost = (e: Event) => {
			e.preventDefault();
			setFailed(true);
		};
		canvas.addEventListener("webglcontextlost", onContextLost);

		renderer.start();

		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("pointermove", onPointerMove);
			reduced.removeEventListener("change", applyMotion);
			clearTimeout(resizeTimer);
			themeObserver.disconnect();
			canvas.removeEventListener("webglcontextlost", onContextLost);
			renderer.destroy();
		};
	}, [failed]);

	if (failed) return null;

	return (
		<canvas
			ref={canvasRef}
			data-id="ascii-shimmer"
			className={cn("pointer-events-none fixed inset-0 h-full w-full", className)}
			aria-hidden
		/>
	);
}
