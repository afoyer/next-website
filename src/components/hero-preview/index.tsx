"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AsciiBackground } from "@/components/ascii-background";
import HeroNavigator from "@/components/hero-navigator";
import { MobilePager } from "@/components/mobile-pager";
import { useTransitionStore } from "@/store/transition";

const DEFAULT_SRC = "/images/gifs/af-ascii.gif";

export function HeroPreview() {
	const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);
	const phase = useTransitionStore((s) => s.phase);
	const registerPreviewEl = useTransitionStore((s) => s.registerPreviewEl);
	const isMobile = useTransitionStore((s) => s.isMobile);
	const bgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		registerPreviewEl(bgRef.current);
		return () => registerPreviewEl(null);
	}, [registerPreviewEl]);

	const handlePreview = (src: string | null) => setPreviewSrc(src ?? DEFAULT_SRC);

	return (
		<>
			{/* full-viewport ascii background — registered as the ripple transition origin */}
			<motion.div
				ref={bgRef}
				className="pointer-events-none fixed inset-0 z-0"
				animate={{ opacity: phase === "idle" ? 1 : 0 }}
				transition={{ duration: 0.25 }}
				aria-hidden
			>
				<AsciiBackground src={previewSrc} />
			</motion.div>

			{/* desktop: navigator floats over the background */}
			<div className="relative z-10 hidden w-full flex-1 min-h-0 sm:flex">
				<div className="mt-6 shrink-0 self-center">
					<HeroNavigator onPreview={handlePreview} />
				</div>
			</div>

			{/* mobile: two-axis pager — mounted only on mobile so its preview effect
			    can't override the desktop default */}
			{isMobile && <MobilePager onPreview={handlePreview} />}
		</>
	);
}
