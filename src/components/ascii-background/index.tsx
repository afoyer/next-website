"use client";

import { useEffect, useRef, useState } from "react";
import { AsciiRenderer } from "./renderer";

const RESIZE_DEBOUNCE_MS = 150;

type Props = { src: string };

export function AsciiBackground({ src }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rendererRef = useRef<AsciiRenderer | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (failed) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		let renderer: AsciiRenderer;
		try {
			renderer = new AsciiRenderer(canvas);
		} catch {
			setFailed(true);
			return;
		}
		rendererRef.current = renderer;

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
			renderer.setTheme(
				style.getPropertyValue("--foreground").trim(),
				style.getPropertyValue("--background").trim(),
			);
		};
		readTheme();
		const themeObserver = new MutationObserver(readTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		const onContextLost = (e: Event) => {
			e.preventDefault();
			setFailed(true);
		};
		canvas.addEventListener("webglcontextlost", onContextLost);

		return () => {
			window.removeEventListener("resize", onResize);
			clearTimeout(resizeTimer);
			themeObserver.disconnect();
			canvas.removeEventListener("webglcontextlost", onContextLost);
			renderer.destroy();
			rendererRef.current = null;
		};
	}, [failed]);

	useEffect(() => {
		const renderer = rendererRef.current;
		if (!renderer) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		renderer.show(src, !reduced).catch((err) => {
			if (process.env.NODE_ENV === "development") console.error("ascii-bg image load", err);
		});
	}, [src]);

	if (failed) {
		return (
			<div
				className="absolute inset-0 bg-linear-to-br/oklch from-zinc-300 to-zinc-100 dark:from-zinc-500 dark:to-slate-900"
				aria-hidden
			/>
		);
	}

	return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
