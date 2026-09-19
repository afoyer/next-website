import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const EASE = "power3.out";

/** ScrollTrigger config shared by every one-shot reveal on the page. */
export function enterOnce(trigger: gsap.DOMTarget, start = "top 82%"): ScrollTrigger.Vars {
	return { trigger, start, once: true };
}

/**
 * Generic scroll reveals for a section, driven by data-id attributes:
 *
 * - `data-id="split"`  → text is split into lines and each line rises out of a mask
 * - `data-id="reveal"` → element fades/rises in; siblings inside the same
 *                        `data-id="reveal-group"` stagger together
 * - `data-id="rule"`   → a horizontal rule draws from left to right
 *
 * `extra` runs inside the same reduced-motion guard for section-specific
 * timelines. Everything is scoped to `ref`, so ids can repeat across sections.
 */
export function useReveal(
	ref: RefObject<HTMLElement | null>,
	extra?: (ctx: { scope: HTMLElement }) => void,
) {
	useGSAP(
		() => {
			const scope = ref.current;
			if (!scope) return;

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				// Line splits. autoSplit re-runs on font load / resize; the tween
				// returned from onSplit is reverted before each re-split.
				for (const el of gsap.utils.toArray<HTMLElement>('[data-id="split"]', scope)) {
					SplitText.create(el, {
						type: "lines",
						mask: "lines",
						autoSplit: true,
						onSplit: (self) => {
							gsap.set(el, { visibility: "visible" });
							return gsap.from(self.lines, {
								yPercent: 110,
								duration: 0.9,
								ease: EASE,
								stagger: 0.08,
								scrollTrigger: enterOnce(el),
							});
						},
					});
				}

				// Staggered groups.
				for (const group of gsap.utils.toArray<HTMLElement>('[data-id="reveal-group"]', scope)) {
					const items = gsap.utils.toArray<HTMLElement>('[data-id="reveal"]', group);
					if (!items.length) continue;
					gsap.from(items, {
						y: 36,
						autoAlpha: 0,
						duration: 0.8,
						ease: EASE,
						stagger: 0.08,
						scrollTrigger: enterOnce(group),
					});
				}

				// Loose reveals (not inside a group).
				const loose = gsap.utils
					.toArray<HTMLElement>('[data-id="reveal"]', scope)
					.filter((el) => !el.closest('[data-id="reveal-group"]'));
				for (const el of loose) {
					gsap.from(el, {
						y: 36,
						autoAlpha: 0,
						duration: 0.8,
						ease: EASE,
						scrollTrigger: enterOnce(el),
					});
				}

				// Rules.
				for (const el of gsap.utils.toArray<HTMLElement>('[data-id="rule"]', scope)) {
					gsap.from(el, {
						scaleX: 0,
						transformOrigin: "left center",
						duration: 1,
						ease: "power2.inOut",
						scrollTrigger: enterOnce(el, "top 90%"),
					});
				}

				extra?.({ scope });
			});
		},
		{ scope: ref },
	);
}
