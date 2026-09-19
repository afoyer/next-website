"use client";

import gsap from "gsap";
import { useRef } from "react";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";
import { tripjam } from "../../content";
import styles from "../index.module.css";
import { SectionHead } from "./SectionHead";

const { hood } = tripjam;

function Arrow() {
	return (
		<>
			<svg
				viewBox="0 0 56 16"
				fill="none"
				stroke="var(--t-line)"
				strokeWidth="2"
				aria-hidden="true"
				className="hidden h-4 w-14 self-center lg:block"
			>
				<path data-id="hood-arrow" d="M2 8h48M44 2l8 6-8 6" />
			</svg>
			<svg
				viewBox="0 0 334 24"
				fill="none"
				stroke="var(--t-line)"
				strokeWidth="2"
				aria-hidden="true"
				className="h-6 w-full lg:hidden"
			>
				<path d="M167 0v16 M160 10l7 7 7-7" />
			</svg>
		</>
	);
}

// 05 — board → /api/itinerary → room, then the stack as pills.
export function HoodSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		const flow = scope.querySelector('[data-id="flow"]');
		if (!flow) return;
		const tl = gsap.timeline({ scrollTrigger: enterOnce(flow, "top 78%") });
		tl.from('[data-id="hood-step"]', {
			y: 40,
			autoAlpha: 0,
			duration: 0.7,
			ease: EASE,
			stagger: 0.28,
		}).from(
			'[data-id="hood-arrow"]',
			{
				scaleX: 0,
				transformOrigin: "left center",
				duration: 0.4,
				ease: "power2.inOut",
				stagger: 0.28,
			},
			0.35,
		);
	});

	return (
		<section
			ref={ref}
			className="flex flex-col items-center gap-7 px-7 pb-18 pt-22 lg:gap-14 lg:px-[170px] lg:pb-[110px] lg:pt-[130px]"
		>
			<SectionHead heading={hood.heading} body={hood.body} />

			<div
				data-id="flow"
				className="flex w-full max-w-[1100px] flex-col gap-2 lg:grid lg:grid-cols-[1fr_56px_1fr_56px_1fr] lg:items-stretch lg:gap-0"
			>
				{hood.steps.map((s, i) => (
					<div key={s.label} className="contents">
						{i > 0 && <Arrow />}
						<div
							data-id="hood-step"
							className={`flex flex-col gap-1.5 rounded-[18px] p-5 lg:gap-2.5 lg:rounded-[22px] lg:p-7 ${
								"dark" in s && s.dark ? "bg-[#1b1b1b] text-white" : "bg-(--t-card)"
							}`}
						>
							<span
								className={`text-xs font-semibold ${
									"dark" in s && s.dark ? `${styles.mono} text-(--t-accent)` : "text-(--t-muted)"
								}`}
							>
								{s.label}
							</span>
							<span className="text-[17px] font-semibold tracking-[-0.01em] lg:text-xl">
								{s.title}
							</span>
							<span
								className={`text-[13px] leading-normal lg:text-sm ${
									"dark" in s && s.dark ? "text-[#b8b3ac]" : "text-(--t-muted)"
								}`}
							>
								{s.body}
							</span>
						</div>
					</div>
				))}
			</div>

			<div data-id="reveal-group" className="flex flex-wrap justify-center gap-2 lg:gap-2.5">
				{hood.stack.map((item) => (
					<span
						key={item}
						data-id="reveal"
						className="rounded-full bg-(--t-card) px-3.5 py-2.25 text-[13px] font-medium lg:px-4.5 lg:py-2.5 lg:text-sm"
					>
						{item}
					</span>
				))}
			</div>
		</section>
	);
}
