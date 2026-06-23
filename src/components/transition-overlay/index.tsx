"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useTransitionStore } from "@/store/transition";

// px the no-ref overlay starts below its resting position — a subtle upward entrance
const SHIFT_UP = 48;

export default function TransitionOverlay() {
	const phase = useTransitionStore((s) => s.phase);
	const previewSrc = useTransitionStore((s) => s.previewSrc);
	const previewRect = useTransitionStore((s) => s.previewRect);
	const transitionVW = useTransitionStore((s) => s.transitionVW);
	const transitionVH = useTransitionStore((s) => s.transitionVH);
	const rippleRadius = useTransitionStore((s) => s.rippleRadius);
	const onExpandComplete = useTransitionStore((s) => s.onExpandComplete);

	const maskDivRef = useRef<HTMLDivElement>(null);

	// Imperatively update mask each frame during rippling (avoids React re-renders at 60fps)
	useEffect(() => {
		if (!maskDivRef.current || phase !== "rippling") return;
		const mask = `radial-gradient(circle at 50% 50%, transparent ${rippleRadius}px, black ${rippleRadius}px)`;
		maskDivRef.current.style.maskImage = mask;
		maskDivRef.current.style.webkitMaskImage = mask;
	}, [rippleRadius, phase]);

	if (phase === "idle" || !previewSrc) return null;

	const initialPos = previewRect
		? {
				top: previewRect.top,
				left: previewRect.left,
				width: previewRect.width,
				height: previewRect.height,
				opacity: 1,
			}
		: // no ref: start slightly below, faded out, and rise + fade into place
			{ top: SHIFT_UP, left: 0, width: transitionVW, height: transitionVH, opacity: 0 };

	const targetDims = { top: 0, left: 0, width: transitionVW, height: transitionVH, opacity: 1 };

	return (
		<motion.div
			style={{ position: "fixed", inset: 0, zIndex: 202, pointerEvents: "none" }}
			aria-hidden
		>
			<motion.div
				ref={maskDivRef}
				// overflow: hidden clips the scale(1.1) blur layer — do not remove
				style={{ position: "absolute", overflow: "hidden" }}
				initial={initialPos}
				animate={targetDims}
				transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
				onAnimationComplete={() => {
					if (phase === "expanding") onExpandComplete();
				}}
			>
				{/* Blurred fill visible in letterbox bars when image ratio ≠ viewport ratio */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={previewSrc}
					alt=""
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						filter: "blur(12px) brightness(0.4)",
						transform: "scale(1.1)",
						zIndex: 0,
					}}
					className="invert grayscale-100 dark:grayscale-0 dark:invert-0"
				/>
				{/* Main preview image — letterboxed with contain */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={previewSrc}
					alt=""
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "contain",
						zIndex: 1,
					}}
					className="invert grayscale-100 dark:grayscale-0 dark:invert-0"
				/>
			</motion.div>
		</motion.div>
	);
}
