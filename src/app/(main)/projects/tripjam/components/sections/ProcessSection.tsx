"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";
import { tripjam } from "../../content";
import { SectionHead } from "./SectionHead";

gsap.registerPlugin(DrawSVGPlugin);

const { process } = tripjam;

function Lane({
	label,
	title,
	body,
	color,
}: {
	label: string;
	title: string;
	body: string;
	color: string;
}) {
	return (
		<div
			data-id="lane"
			className="flex flex-col gap-2 rounded-[18px] bg-(--t-paper) p-5 lg:gap-2 lg:rounded-[22px] lg:px-7 lg:py-6.5"
		>
			<span className="text-xs font-semibold" style={{ color }}>
				{label}
			</span>
			<span className="text-base font-semibold tracking-[-0.01em] lg:text-[17px]">{title}</span>
			<span className="text-[13px] leading-normal text-(--t-muted) lg:text-sm">{body}</span>
		</div>
	);
}

// The "same card everywhere" sketch: board card, search row, itinerary list.
function SameCard() {
	const tile = "flex h-[58px] flex-1 rounded-[10px] bg-white p-2.25";
	const art = "rounded bg-linear-to-br from-[#6e8fb8] to-[#2a3d5c]";
	const line = "rounded-[3px] bg-[#1b1b1b]";
	return (
		<div className="flex gap-2">
			<div className={`${tile} flex-col gap-1.5`}>
				<span className={`${art} h-6`} />
				<span className={`${line} h-[5px] w-[70%]`} />
			</div>
			<div className={`${tile} gap-2`}>
				<span className={`${art} size-6 shrink-0`} />
				<span className="flex flex-1 flex-col gap-1.5">
					<span className={`${line} h-[5px] w-[90%]`} />
					<span className="h-1 w-[60%] rounded-[3px] bg-[#c9c4bc]" />
				</span>
			</div>
			<div className={`${tile} flex-col gap-1.5`}>
				{["first", "second", "third"].map((row, i) => (
					<span key={row} className="flex gap-1">
						<span className="h-1 w-[18px] rounded-[3px] bg-[#c9c4bc]" />
						<span className={`${line} h-1`} style={{ width: i === 2 ? "36%" : "60%" }} />
					</span>
				))}
			</div>
		</div>
	);
}

// 04 — designers ∥ engineers converge in Cursor → one product.
export function ProcessSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		const diagram = scope.querySelector('[data-id="diagram"]');
		if (!diagram) return;
		// Lanes slide in, the connectors draw, the Cursor node lands, then the result.
		const tl = gsap.timeline({ scrollTrigger: enterOnce(diagram, "top 75%") });
		tl.from('[data-id="lane"]', { x: -40, autoAlpha: 0, duration: 0.7, ease: EASE, stagger: 0.12 })
			.from(
				'[data-id="connector"]',
				{ drawSVG: "0%", duration: 0.6, ease: "power2.inOut", stagger: 0.1 },
				0.4,
			)
			.from('[data-id="node"]', { scale: 0.92, autoAlpha: 0, duration: 0.7, ease: EASE }, 0.8)
			.from('[data-id="result"]', { x: 40, autoAlpha: 0, duration: 0.7, ease: EASE }, 1.1);
	});

	return (
		<section
			ref={ref}
			className="flex flex-col items-center gap-7 overflow-x-clip bg-(--t-card) px-7 pb-16 pt-20 lg:gap-16 lg:px-[170px] lg:py-30"
		>
			<SectionHead heading={process.heading} body={process.body} />

			<div
				data-id="diagram"
				className="grid w-full max-w-[1100px] grid-cols-1 gap-2.5 lg:grid-cols-[1fr_72px_1fr_72px_1fr] lg:items-center lg:gap-0"
			>
				<div className="flex flex-col gap-2.5 lg:gap-4">
					<Lane color="#c43a7b" {...process.designers} />
					<Lane color="#4c7dd9" {...process.engineers} />
				</div>

				{/* Two lanes merging into one — a vertical arrow on phones. */}
				<svg
					viewBox="0 0 72 240"
					fill="none"
					stroke="var(--t-line)"
					strokeWidth="2"
					aria-hidden="true"
					className="hidden h-[240px] w-[72px] lg:block"
				>
					<path data-id="connector" d="M0 60 C 40 60, 40 120, 70 120" />
					<path data-id="connector" d="M0 180 C 40 180, 40 120, 70 120" />
				</svg>
				<Down />

				<div
					data-id="node"
					className="flex flex-col gap-2 rounded-[20px] bg-[#1b1b1b] p-5.5 text-white shadow-[0_30px_70px_rgba(27,27,27,0.22)] lg:gap-3 lg:rounded-[26px] lg:px-8 lg:py-8.5"
				>
					<span className="text-xs font-semibold text-(--t-accent)">{process.cursor.label}</span>
					<span className="text-lg font-semibold leading-tight tracking-[-0.02em] lg:text-[22px]">
						{process.cursor.title}
					</span>
					<span className="text-[13px] leading-relaxed text-[#b8b3ac] lg:text-sm">
						{process.cursor.body}
					</span>
				</div>

				<svg
					viewBox="0 0 72 240"
					fill="none"
					stroke="var(--t-line)"
					strokeWidth="2"
					aria-hidden="true"
					className="hidden h-[240px] w-[72px] lg:block"
				>
					<path data-id="connector" d="M2 120h68" />
				</svg>
				<Down />

				<div
					data-id="result"
					className="flex flex-col gap-2 rounded-[18px] bg-(--t-paper) p-5 lg:gap-3.5 lg:rounded-[22px] lg:px-7 lg:py-6.5"
				>
					<span className="text-xs font-semibold text-(--t-accent)">{process.result.label}</span>
					<span className="text-base font-semibold tracking-[-0.01em] lg:text-[17px]">
						{process.result.title}
					</span>
					<SameCard />
				</div>
			</div>

			<div
				data-id="reveal-group"
				className="grid w-full max-w-[960px] grid-cols-1 gap-4.5 text-center lg:grid-cols-3 lg:gap-12"
			>
				{process.beats.map((b) => (
					<div key={b.title} data-id="reveal" className="flex flex-col gap-1 lg:gap-2">
						<span className="text-base font-semibold lg:text-[17px]">{b.title}</span>
						<span className="text-[13px] leading-relaxed text-(--t-muted) lg:text-sm">
							{b.body}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}

// Phone-only connector between stacked steps.
function Down() {
	return (
		<svg
			viewBox="0 0 334 28"
			fill="none"
			stroke="var(--t-line)"
			strokeWidth="2"
			aria-hidden="true"
			className="h-7 w-full lg:hidden"
		>
			<path d="M167 0v20 M160 14l7 7 7-7" />
		</svg>
	);
}
