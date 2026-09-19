"use client";

import gsap from "gsap";
import { Fragment, useRef } from "react";
import { type PipelineRow, pantonify } from "../../content";
import { Eyebrow } from "./Eyebrow";
import styles from "./index.module.css";
import { EASE, enterOnce, useReveal } from "./useReveal";

const { pipeline } = pantonify;

function Arrow() {
	return (
		<svg
			data-id="pipe-arrow"
			width="40"
			height="16"
			viewBox="0 0 40 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			className="hidden text-(--p-muted) lg:block"
		>
			<path d="M2 8h34M30 2l6 6-6 6" />
		</svg>
	);
}

function PantoneChip({ row }: { row: PipelineRow }) {
	return (
		<div
			data-id="pipe-chip"
			className={`${styles.chipSmall} flex flex-col border border-(--p-line) bg-white`}
		>
			<div className="h-7.5 lg:h-10" style={{ backgroundColor: `#${row.hex}` }} />
			<div className="flex items-baseline justify-between px-2 pb-1.5 pt-1.5 text-[10px] font-bold text-[#121212] lg:px-2.5 lg:pb-2 lg:text-xs">
				<span>PANTONE</span>
				<span>{row.pantone}</span>
			</div>
		</div>
	);
}

function Row({ row }: { row: PipelineRow }) {
	return (
		<div data-id="pipe-row" className="flex flex-col gap-2">
			{/* Mobile: name above the tiles. Desktop: name sits beside the art tile. */}
			<div className="flex flex-col gap-0.5 lg:hidden">
				<span className="text-[13px] font-bold uppercase tracking-[0.02em]">{row.artist}</span>
				<span className="text-xs text-(--p-muted)">{row.title}</span>
			</div>
			<div className="grid grid-cols-[64px_1fr_1fr] items-center gap-2.5 lg:grid-cols-[1.4fr_40px_1fr_40px_1.2fr] lg:gap-2">
				<div className="flex items-center gap-3">
					<div
						data-id="pipe-art"
						className="size-16 shrink-0"
						style={{ backgroundImage: row.artGradient }}
					/>
					<div className="hidden flex-col gap-0.5 lg:flex">
						<span className="text-sm font-bold uppercase tracking-[0.02em]">{row.artist}</span>
						<span className="text-[13px] text-(--p-muted)">{row.title}</span>
					</div>
				</div>
				<Arrow />
				<div className="flex items-center gap-2 lg:gap-2.5">
					<div
						data-id="pipe-avg"
						className="size-8 shrink-0 lg:size-10"
						style={{ backgroundColor: `#${row.hex}` }}
					/>
					<span className={`${styles.mono} text-xs lg:text-[13px]`}>#{row.hex}</span>
				</div>
				<Arrow />
				<PantoneChip row={row} />
			</div>
		</div>
	);
}

// 04 — art → average colour → Pantone match, plus the two lines that do it.
export function PipelineSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		// Each row plays left to right: art appears, arrow draws, swatch pops, chip lands.
		for (const row of gsap.utils.toArray<HTMLElement>('[data-id="pipe-row"]', scope)) {
			const tl = gsap.timeline({ scrollTrigger: enterOnce(row, "top 85%") });
			tl.from(row.querySelectorAll('[data-id="pipe-art"]'), {
				scale: 0.6,
				autoAlpha: 0,
				duration: 0.5,
				ease: EASE,
			})
				.from(
					row.querySelectorAll('[data-id="pipe-arrow"]'),
					{
						scaleX: 0,
						transformOrigin: "left center",
						duration: 0.4,
						ease: "power2.inOut",
						stagger: 0.35,
					},
					0.2,
				)
				.from(
					row.querySelectorAll('[data-id="pipe-avg"]'),
					{ scale: 0, duration: 0.5, ease: "back.out(2)" },
					0.45,
				)
				.from(
					row.querySelectorAll('[data-id="pipe-chip"]'),
					{ y: 24, autoAlpha: 0, duration: 0.6, ease: EASE },
					0.8,
				);
		}
	});

	return (
		<section
			ref={ref}
			className="page grid grid-cols-1 gap-6 border-b border-(--p-line) bg-(--p-card) py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-24"
		>
			<div className="flex flex-col gap-6 lg:col-span-4">
				<Eyebrow>Under the hood · 04</Eyebrow>
				<h2
					data-id="split"
					className="text-[34px] font-bold leading-[1.04] tracking-[-0.03em] lg:text-[44px]"
				>
					{pipeline.heading}
				</h2>
				<p data-id="reveal" className="text-[15px] leading-relaxed text-(--p-muted) lg:text-base">
					{pipeline.body}
				</p>
				<pre
					data-id="reveal"
					className={`${styles.mono} overflow-x-auto rounded-lg bg-[#121212] px-4 py-3.5 text-[11px] leading-[1.7] text-[#d9d9d9] lg:mt-2 lg:px-5 lg:py-4.5 lg:text-[12.5px]`}
				>
					{pipeline.code.map((line) => (
						<span key={line} className={`block ${line.startsWith("//") ? "text-[#8a8a8a]" : ""}`}>
							{line}
						</span>
					))}
				</pre>
			</div>

			<div className="flex flex-col gap-4 lg:col-span-7 lg:col-start-6 lg:gap-[18px] lg:self-center">
				<div
					data-id="reveal"
					className="grid grid-cols-[64px_1fr_1fr] gap-2.5 border-b border-(--p-line) pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-(--p-muted) lg:grid-cols-[1.4fr_40px_1fr_40px_1.2fr] lg:gap-2 lg:px-1 lg:pb-2.5 lg:text-[11px]"
				>
					{pipeline.columns.map((label, i) => (
						<Fragment key={label}>
							{i > 0 && <span className="hidden lg:block" />}
							<span className="lg:hidden">{pipeline.columnsShort[i]}</span>
							<span className="hidden lg:block">{label}</span>
						</Fragment>
					))}
				</div>
				<div className="flex flex-col gap-4 lg:gap-[18px]">
					{pipeline.rows.map((row) => (
						<Row key={row.pantone} row={row} />
					))}
				</div>
				<p
					data-id="reveal"
					className="text-[11px] leading-normal text-(--p-muted) lg:mt-2 lg:text-xs"
				>
					{pipeline.footnote}
				</p>
			</div>
		</section>
	);
}
