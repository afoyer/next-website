"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";
import { tripjam } from "../../content";
import { SectionHead } from "./SectionHead";

const { board } = tripjam;

// 02 — the README screenshot, floating, with numbered callouts.
export function BoardSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		const frame = scope.querySelector('[data-id="board-frame"]');
		if (!frame) return;
		const tl = gsap.timeline({ scrollTrigger: enterOnce(frame, "top 80%") });
		tl.from(frame, { y: 120, autoAlpha: 0, duration: 1.2, ease: EASE }).from(
			'[data-id="board-callout"]',
			{ scale: 0.6, autoAlpha: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.12 },
			0.7,
		);
	});

	return (
		<section
			ref={ref}
			className="flex flex-col items-center gap-8 overflow-hidden pt-6 lg:gap-14 lg:px-[170px] lg:pt-10"
		>
			<div className="px-7 lg:px-0">
				<SectionHead heading={board.heading} body={board.body} maxWidth="max-w-[640px]" />
			</div>

			{/* Phones get a 640px board they can swipe sideways; desktop centres it. */}
			<div className="w-full overflow-x-auto px-7 [scrollbar-width:none] lg:overflow-visible lg:px-0">
				<div
					data-id="board-frame"
					className="relative w-[640px] lg:mx-auto lg:w-full lg:max-w-[1100px]"
				>
					<Image
						src={board.image.src}
						alt={board.image.alt}
						width={board.image.width}
						height={board.image.height}
						sizes="(min-width: 1024px) 1100px, 640px"
						className="block h-[420px] w-full rounded-[18px] object-cover object-[8%_30%] shadow-[0_24px_60px_rgba(60,50,40,0.18)] lg:h-[700px] lg:rounded-t-3xl lg:object-[50%_28%] lg:shadow-[0_40px_100px_rgba(60,50,40,0.18)]"
					/>
					{board.callouts.map((c) => (
						<div
							key={c.n}
							data-id="board-callout"
							className="absolute flex items-center gap-2 rounded-full bg-[#1b1b1b]/92 py-1.5 pl-1.5 pr-3 text-[11px] font-semibold text-white backdrop-blur-sm lg:py-2 lg:pl-2 lg:pr-3.5 lg:text-xs"
							style={{ left: `${c.x}%`, top: `${c.y}%` }}
						>
							<span className="flex size-[18px] items-center justify-center rounded-full bg-(--t-accent) text-[10px] font-bold text-(--t-accent-ink) lg:size-5 lg:text-[11px]">
								{c.n}
							</span>
							{c.label}
						</div>
					))}
				</div>
			</div>
			<span className="-mt-4 px-7 text-xs text-(--t-muted) lg:hidden">
				Swipe sideways to see the places sidebar.
			</span>
		</section>
	);
}
