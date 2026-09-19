"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import Logo from "@/app/logo";
import { EASE, enterOnce, useReveal } from "@/hooks/useReveal";
import { tripjam } from "../../content";

const { cta, intro } = tripjam;

// 06 — the one dark band on the page: deep green, white type, green pill.
export function CtaSection() {
	const ref = useRef<HTMLElement>(null);

	useReveal(ref, ({ scope }) => {
		const heading = scope.querySelector<HTMLElement>('[data-id="cta-heading"]');
		if (!heading) return;
		SplitText.create(heading, {
			type: "words",
			autoSplit: true,
			onSplit: (self) => {
				gsap.set(heading, { visibility: "visible" });
				return gsap.from(self.words, {
					y: 40,
					autoAlpha: 0,
					duration: 0.9,
					ease: EASE,
					stagger: 0.07,
					scrollTrigger: enterOnce(scope, "top 75%"),
				});
			},
		});
	});

	return (
		<section
			ref={ref}
			className="flex flex-col items-center justify-between gap-12 bg-(--t-forest) px-7 pb-9 pt-18 text-center text-white lg:min-h-[460px] lg:px-[170px] lg:pb-14 lg:pt-30"
		>
			<div className="flex flex-col items-center gap-5.5 lg:gap-7">
				<h2
					data-id="cta-heading"
					className="motion-safe:invisible text-[42px] font-semibold leading-[1.04] tracking-[-0.02em] lg:text-[68px] lg:leading-[1.02]"
				>
					{cta.heading}
				</h2>
				<a
					data-id="reveal"
					href={intro.meta.sourceUrl}
					target="_blank"
					rel="noreferrer"
					className="flex h-13 items-center justify-center gap-3 rounded-full bg-(--t-accent) px-7 text-[15px] font-semibold text-(--t-accent-ink) transition-transform hover:scale-[1.03] active:scale-[0.98]"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
					</svg>
					{cta.sourceLabel}
				</a>
			</div>
			<div data-id="reveal" className="flex items-center gap-3 text-xs font-medium lg:gap-3.5">
				<span className="flex size-8 items-center justify-center rounded-full bg-white text-[11px] font-black tracking-[-0.06em] text-(--t-forest)">
					<Logo className="p-1" />
				</span>
				<span>{cta.footer}</span>
			</div>
		</section>
	);
}
