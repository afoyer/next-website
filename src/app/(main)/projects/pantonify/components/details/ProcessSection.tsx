"use client";

import gsap from "gsap";
import { useRef } from "react";
import { type ProcessStep, pantonify } from "../../content";
import { Eyebrow } from "./Eyebrow";
import styles from "./index.module.css";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";

const { process } = pantonify;

// Small inline SVG that stands in for the Spotify mark on step 01.
function SpotifyMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
			<circle cx="12" cy="12" r="11" fill="#121212" />
			<path
				d="M6.5 9.2c3.6-1 8-.7 11 1.1M7.2 12.2c3-.8 6.6-.5 9.2 1M7.9 15c2.4-.6 5.2-.4 7.3.8"
				stroke="#1ED760"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}

// Tiny stacked-swatch card that stands in for the exported result on step 05.
function MiniCard() {
	return (
		<div className="flex h-[88px] w-11 flex-col overflow-hidden rounded-lg border border-[#e3e2dd] bg-[#f4f3ef] lg:h-32 lg:w-16 lg:rounded-[10px]">
			<div className="h-3 lg:h-4.5" />
			<div className="h-4 bg-[#2b2f3b] lg:h-5.5" />
			<div className="h-2 lg:h-3" />
			<div className="h-4 bg-[#7a5c9a] lg:h-5.5" />
			<div className="h-2 lg:h-3" />
			<div className="h-4 bg-[#8c8a93] lg:h-5.5" />
		</div>
	);
}

// What sits inside each chip's colour block.
function SwatchContent({ step }: { step: ProcessStep }) {
	switch (step.step) {
		case "01":
			return <SpotifyMark className="size-5.5 lg:size-7" />;
		case "02":
			return (
				<span className={`${styles.mono} text-[10px] text-(--p-accent) lg:text-[11px]`}>
					{"{ items: [ … ] }"}
				</span>
			);
		case "03":
			return (
				<div className="absolute bottom-0 right-0 h-[55%] w-[60%] bg-linear-to-br from-[#8d7a86] to-[#3a2f33] opacity-35 lg:top-0 lg:h-full lg:w-[45%]" />
			);
		case "04":
			return (
				<span className="text-[10px] font-bold tracking-[0.1em] text-white lg:text-[11px]">
					18-3520
				</span>
			);
		default:
			return <MiniCard />;
	}
}

function Chip({ step }: { step: ProcessStep }) {
	const white = step.swatch.toUpperCase() === "#FFFFFF";
	// Blocks with content pinned to a corner vs. centred (step 05).
	const align =
		step.step === "01"
			? "items-start justify-end"
			: step.step === "05"
				? "items-center justify-center"
				: "items-end justify-start lg:justify-end";

	return (
		<div
			data-id="chip"
			className={`${styles.chip} flex flex-row border border-(--p-line) bg-(--p-card) lg:flex-col`}
		>
			<div
				data-id="chip-swatch"
				className={`relative flex min-h-32 w-24 shrink-0 overflow-hidden p-2.5 lg:h-50 lg:w-full lg:p-3.5 ${align} ${
					white ? "border-r border-(--p-line) lg:border-r-0 lg:border-b" : ""
				}`}
				style={{ backgroundColor: step.swatch }}
			>
				<SwatchContent step={step} />
			</div>
			<div className="flex flex-col gap-1.5 px-3.5 py-3 lg:gap-2 lg:px-4 lg:pb-4.5 lg:pt-3.5">
				<span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--p-muted) lg:text-[11px]">
					Step {step.step}
				</span>
				<span className="text-lg font-bold tracking-[-0.01em] lg:text-xl">{step.name}</span>
				<span className={`${styles.mono} text-[11px] text-(--p-muted) lg:text-xs`}>
					{step.code}
				</span>
				<span className="text-[13px] leading-snug text-(--p-muted) lg:mt-1">{step.body}</span>
			</div>
		</div>
	);
}

// 03 — five Pantone chips, one per pipeline step.
export function ProcessSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		const grid = scope.querySelector<HTMLElement>('[data-id="chip-grid"]');
		if (!grid) return;
		const tl = gsap.timeline({ scrollTrigger: enterOnce(grid, "top 78%") });
		// Chips slide up one after another…
		tl.from('[data-id="chip"]', {
			y: 60,
			autoAlpha: 0,
			duration: 0.8,
			ease: EASE,
			stagger: 0.1,
		});
		// …and each colour block "prints" down its chip just behind it.
		tl.from(
			'[data-id="chip-swatch"]',
			{
				scaleY: 0,
				transformOrigin: "top center",
				duration: 0.7,
				ease: "power2.inOut",
				stagger: 0.1,
			},
			0.15,
		);
	});

	return (
		<section
			ref={ref}
			className="page flex flex-col gap-7 border-b border-(--p-line) py-14 lg:gap-14 lg:py-24"
		>
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
				<div className="flex flex-col gap-6">
					<Eyebrow>Process · 03</Eyebrow>
					<h2
						data-id="split"
						className="text-[34px] font-bold leading-[1.02] tracking-[-0.03em] lg:text-5xl"
					>
						{process.heading}
					</h2>
				</div>
				<p
					data-id="reveal"
					className="hidden max-w-[400px] text-base leading-normal text-(--p-muted) lg:block"
				>
					{process.body}
				</p>
			</div>

			<div data-id="chip-grid" className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-5">
				{process.steps.map((step) => (
					<Chip key={step.step} step={step} />
				))}
			</div>
		</section>
	);
}
