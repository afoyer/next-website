"use client";

import gsap from "gsap";
import { useRef, useState } from "react";
import { pantonify, type TimeRange } from "../../content";
import { Eyebrow } from "./Eyebrow";
import styles from "./index.module.css";
import { ResultCard } from "./ResultCard";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";

const { result } = pantonify;

// 02 — dark section: the result card, time-range pills and the endpoint they hit.
export function ResultSection() {
	const ref = useRef<HTMLElement>(null);
	const [range, setRange] = useState<TimeRange["value"]>(result.timeRanges[0].value);
	const activeLabel = result.timeRanges.find((t) => t.value === range)?.label ?? "";

	useReveal(ref, ({ scope }) => {
		// The card rises and settles upright, then the chips behind it fan out
		// and each swatch band prints down the card.
		const tl = gsap.timeline({ scrollTrigger: enterOnce(scope, "top 70%") });
		tl.from('[data-id="result-card"]', {
			y: 140,
			rotate: 5,
			autoAlpha: 0,
			duration: 1.2,
			ease: EASE,
		})
			.to(
				'[data-id="result-fan"]',
				{
					rotate: (i: number) => 7 * (2 - i),
					transformOrigin: "0% 100%",
					duration: 0.9,
					ease: EASE,
					stagger: -0.08,
				},
				0.5,
			)
			.from(
				'[data-id="result-band"]',
				{
					scaleY: 0,
					transformOrigin: "top center",
					duration: 0.6,
					ease: "power2.inOut",
					stagger: 0.12,
				},
				0.6,
			);
		// The big "02" drifts against the scroll.
		gsap.fromTo(
			'[data-id="result-numeral"]',
			{ y: 80 },
			{
				y: -80,
				ease: "none",
				scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
			},
		);
	});

	return (
		<section
			ref={ref}
			className="page relative grid grid-cols-1 gap-7 overflow-hidden bg-[#121212] py-14 text-white lg:grid-cols-12 lg:gap-x-6 lg:py-24"
		>
			<span
				data-id="result-numeral"
				aria-hidden="true"
				className="pointer-events-none absolute -right-2 top-5 select-none text-[160px] font-black leading-none tracking-[-0.06em] text-[#1c1c1c] lg:right-8 lg:top-14 lg:text-[220px]"
			>
				02
			</span>

			<div className="relative flex flex-col justify-between gap-7 lg:col-span-5">
				<div className="flex flex-col gap-6 lg:gap-7">
					<Eyebrow tone="accent">The result · 02</Eyebrow>
					<h2
						data-id="split"
						className="text-4xl font-bold leading-none tracking-[-0.03em] lg:text-[56px]"
					>
						{result.heading}
					</h2>
					<p
						data-id="reveal"
						className="max-w-[460px] text-[15px] leading-relaxed text-[#b3b3b3] lg:text-[17px]"
					>
						{result.body}
					</p>
				</div>

				<div data-id="reveal-group" className="flex flex-col gap-3">
					<span
						data-id="reveal"
						className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b3b3b3] lg:text-[11px]"
					>
						Time range
					</span>
					<div data-id="reveal" className="flex flex-wrap gap-2">
						{result.timeRanges.map((t) => {
							const active = t.value === range;
							return (
								<button
									key={t.value}
									type="button"
									aria-pressed={active}
									onClick={() => setRange(t.value)}
									className={`h-11 rounded-full border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors lg:px-5 lg:text-[13px] ${
										active
											? "border-(--p-accent) bg-(--p-accent) text-[#121212]"
											: "border-[#4d4d4d] text-white hover:border-white"
									}`}
								>
									{t.label}
								</button>
							);
						})}
					</div>
					<span data-id="reveal" className={`${styles.mono} text-xs text-[#8a8a8a]`}>
						{result.endpoint}
						{range}
					</span>
				</div>
			</div>

			<div className="relative flex flex-col items-start gap-4 lg:col-span-6 lg:col-start-7 lg:items-end lg:justify-center lg:pr-20">
				<ResultCard period={activeLabel} />
				<div
					data-id="reveal"
					className="mt-14 flex max-w-[230px] flex-col gap-1.5 rounded-[10px] border border-[#2e2e2e] bg-[#1e1e1e] px-4 py-3.5 lg:absolute lg:bottom-10 lg:left-0 lg:mt-0"
				>
					<span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--p-accent)">
						{result.callout.label}
					</span>
					<span className="text-[13px] leading-snug text-[#d9d9d9]">{result.callout.body}</span>
				</div>
			</div>
		</section>
	);
}
