"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { pantonify } from "../../content";
import { EASE, enterOnce, useReveal } from "./useReveal";

const { cta, meta } = pantonify;

// 06 — full-bleed green sign-off with the source link.
export function CtaSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		// Headline letters drop in one by one; the rest of the section follows.
		const heading = scope.querySelector<HTMLElement>('[data-id="cta-heading"]');
		if (!heading) return;
		SplitText.create(heading, {
			type: "chars",
			autoSplit: true,
			onSplit: (self) => {
				gsap.set(heading, { visibility: "visible" });
				return gsap.from(self.chars, {
					yPercent: 120,
					rotate: 6,
					autoAlpha: 0,
					duration: 0.9,
					ease: EASE,
					stagger: 0.035,
					scrollTrigger: enterOnce(scope, "top 75%"),
				});
			},
		});
	});

	return (
		<section
			ref={ref}
			className="page flex flex-col justify-between gap-8 overflow-hidden bg-green-500 py-12 text-[#121212] lg:flex-row lg:items-end lg:py-20 dark:bg-green-700"
		>
			<div className="flex flex-col gap-5 lg:gap-7">
				<h2
					data-id="cta-heading"
					className="motion-safe:invisible text-[56px] font-bold leading-[0.95] tracking-[-0.04em] lg:text-[88px]"
				>
					{cta.heading}
				</h2>
				<div
					data-id="reveal-group"
					className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-4"
				>
					<a
						data-id="reveal"
						href={meta.sourceUrl}
						target="_blank"
						rel="noreferrer"
						className="flex h-13 items-center justify-center gap-3 rounded-full bg-[#121212] px-6 text-[15px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
						</svg>
						{cta.sourceLabel} ↗
					</a>
				</div>
			</div>

			<div
				data-id="reveal"
				className="flex items-center justify-between gap-3 text-[11px] font-bold tracking-[0.12em] text-(--p-accent-ink) lg:flex-col-reverse lg:items-end lg:gap-2.5 lg:text-xs"
			>
				<span>{cta.footer}</span>
				<span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-[#b8b8b8] to-[#e0e0e0] text-xs font-black tracking-[-0.06em] text-[#121212] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.15)] lg:size-11">
					AF
				</span>
			</div>
		</section>
	);
}
