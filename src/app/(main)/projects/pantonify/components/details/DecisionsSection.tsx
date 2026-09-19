"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { pantonify } from "../../content";
import { Eyebrow } from "./Eyebrow";
import { EASE, enterOnce, useReveal } from "./useReveal";

const { decisions } = pantonify;

// The Figma mockup inside a small browser frame — the same chrome the hero uses.
function MockupFrame() {
	return (
		<div className="flex flex-col gap-3.5">
			<div
				data-id="mockup-frame"
				className="relative border border-(--p-line) bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:p-3"
			>
				<div className="flex items-center gap-1.5 px-0.5 pb-2 lg:pb-2.5">
					<span className="size-2 rounded-full bg-[#ff5f57]" />
					<span className="size-2 rounded-full bg-[#febc2e]" />
					<span className="size-2 rounded-full bg-[#28c840]" />
					<span className="ml-2 text-[10px] font-medium text-[#5f5f5c] lg:text-[11px]">
						{decisions.mockup.frameLabel}
					</span>
				</div>
				<div className="relative h-[180px] overflow-hidden lg:h-[520px]">
					{/* Slightly taller than its box so the parallax never shows an edge. */}
					<Image
						data-id="mockup-img"
						src={decisions.mockup.src}
						alt={decisions.mockup.alt}
						fill
						sizes="(min-width: 1024px) 640px, 100vw"
						className="scale-110 object-cover object-top"
					/>
				</div>
			</div>
			<div data-id="reveal" className="flex justify-between text-xs text-(--p-muted)">
				<span className="font-bold uppercase tracking-[0.12em]">Figma → Next.js</span>
				<span className="hidden lg:inline">{decisions.mockup.caption}</span>
			</div>
		</div>
	);
}

// 05 — design decisions beside the Figma mockups.
export function DecisionsSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		gsap.from('[data-id="mockup-frame"]', {
			y: 80,
			autoAlpha: 0,
			duration: 1,
			ease: EASE,
			scrollTrigger: enterOnce('[data-id="mockup-frame"]', "top 85%"),
		});
		// Gentle parallax on the mockup while the section scrolls through.
		gsap.fromTo(
			'[data-id="mockup-img"]',
			{ yPercent: -5 },
			{
				yPercent: 5,
				ease: "none",
				scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
			},
		);
	});

	return (
		<section
			ref={ref}
			className="page grid grid-cols-1 gap-6 py-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-7 lg:py-24"
		>
			<div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-1 lg:gap-7">
				<Eyebrow>Design decisions · 05</Eyebrow>
				<h2
					data-id="split"
					className="text-[34px] font-bold leading-[1.04] tracking-[-0.03em] lg:text-[44px]"
				>
					{decisions.heading}
				</h2>
			</div>

			{/* Mobile: between heading and list. Desktop: right column, both rows. */}
			<div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
				<MockupFrame />
			</div>

			<div
				data-id="reveal-group"
				className="flex flex-col border-t border-(--p-line) lg:col-span-5 lg:row-start-2"
			>
				{decisions.items.map((item, i) => (
					<div
						key={item.title}
						data-id="reveal"
						className={`grid grid-cols-[36px_1fr] gap-2 py-3.5 lg:grid-cols-[56px_1fr] lg:gap-3 lg:py-5 ${
							i === decisions.items.length - 1 ? "" : "border-b border-(--p-line)"
						}`}
					>
						<span className="pt-0.5 text-[11px] font-bold tracking-[0.1em] text-(--p-muted) lg:text-xs">
							{String(i + 1).padStart(2, "0")}
						</span>
						<div className="flex flex-col gap-1 lg:gap-1.5">
							<span className="text-[15px] font-bold lg:text-[17px]">{item.title}</span>
							<span className="text-[13px] leading-normal text-(--p-muted) lg:text-sm">
								{item.body}
							</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
