"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AsciiBackground, type AsciiBackgroundHandle } from "@/components/ascii-background";
import HeroNavigator from "@/components/hero-navigator";
import { MobilePager } from "@/components/mobile-pager";
import { site } from "@/content/site";
import { useTransitionStore } from "@/store/transition";

const DEFAULT_SRC: string = site.defaultHeroImage;
// the pager's text sits directly on the ascii glyphs, so keep them faint on mobile
const MOBILE_BG_OPACITY = 0.4;

export function HeroPreview() {
	const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);
	const phase = useTransitionStore((s) => s.phase);
	const registerPreviewEl = useTransitionStore((s) => s.registerPreviewEl);
	const isMobile = useTransitionStore((s) => s.isMobile);
	const boundsRef = useRef<HTMLDivElement>(null);
	const asciiRef = useRef<AsciiBackgroundHandle>(null);

	// the main page has no per-link expand origin — links rise from the bottom.
	// register null on mount so the overlay takes the shift-up path, and to clear
	// any ref a previous page (e.g. a link card) left registered.
	useEffect(() => {
		registerPreviewEl(null);
	}, [registerPreviewEl]);

	const handlePreview = (src: string | null) => setPreviewSrc(src ?? DEFAULT_SRC);

	// center the ascii image in the space below the chrome above it — the pager's
	// tab bar on mobile, the fixed navbar on desktop — rather than the full
	// viewport; falls back to the viewport center if the anchor is absent
	useEffect(() => {
		const anchor = document.querySelector<HTMLElement>(
			isMobile ? '[data-id="mobile-tabs"]' : '[data-id="site-nav"]',
		);
		const report = () => {
			const anchorBottom = anchor?.getBoundingClientRect().bottom ?? 0;
			asciiRef.current?.setCenterY((anchorBottom + window.innerHeight) / 2);
		};
		report();
		const observer = anchor ? new ResizeObserver(report) : null;
		if (anchor) observer?.observe(anchor);
		window.addEventListener("resize", report);
		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", report);
		};
	}, [isMobile]);

	return (
		<>
			{/* full-viewport ascii background — fades out while a transition is in flight */}
			<motion.div
				className="pointer-events-none fixed inset-0 z-0"
				animate={{ opacity: phase !== "idle" ? 0 : isMobile ? MOBILE_BG_OPACITY : 1 }}
				transition={{ duration: 0.25 }}
				aria-hidden
			>
				<AsciiBackground ref={asciiRef} src={previewSrc} />
			</motion.div>

			{/* desktop: navigator floats over the background */}
			<div ref={boundsRef} className="relative z-10 hidden w-full flex-1 min-h-0 sm:flex">
				<div className="mt-6 shrink-0 self-center">
					<HeroNavigator onPreview={handlePreview} boundsRef={boundsRef} />
				</div>
			</div>

			{/* mobile: two-axis pager — mounted only on mobile so its preview effect
			    can't override the desktop default */}
			{isMobile && <MobilePager onPreview={handlePreview} />}
		</>
	);
}
