import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/** How far ahead (in viewports) a section top can be and still pull the screen to it. */
const REACH = 0.5;
/** How far past a section top you can be and still settle back onto it. */
const BACK_TOLERANCE = 0.12;

/**
 * Glides the viewport to the top of the next section once the user scrolls
 * near the end of the current one. Sections are the direct children of `ref`.
 *
 * Only tops in the scroll direction within REACH count, so long sections on
 * phones stay readable mid-way instead of snapping every time the wheel stops.
 * The tween goes through native scrollTop; Lenis adopts external scroll
 * positions when it is not animating, and ScrollTrigger cancels the glide on
 * any wheel/touch input.
 */
export function useSectionSnap(ref: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			const wrapper = ref.current;
			if (!wrapper) return;
			const sections = Array.from(wrapper.children) as HTMLElement[];

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				ScrollTrigger.create({
					start: 0,
					end: () => ScrollTrigger.maxScroll(window),
					snap: {
						snapTo: (progress, self) => {
							if (!self) return progress;
							const max = self.end;
							const y = progress * max;
							const vh = window.innerHeight;
							const dir = self.direction || 1;

							let best: number | null = null;
							for (const section of sections) {
								const top = section.getBoundingClientRect().top + window.scrollY;
								// Signed distance along the direction of travel.
								const d = (top - y) * dir;
								if (d < -BACK_TOLERANCE * vh || d > REACH * vh) continue;
								if (best === null || Math.abs(top - y) < Math.abs(best - y)) best = top;
							}
							return best === null ? progress : Math.min(best, max) / max;
						},
						duration: { min: 0.35, max: 0.9 },
						delay: 0.1,
						ease: "power2.inOut",
					},
				});
			});
		},
		{ scope: ref },
	);
}
