import gsap from "gsap";
// gsap ships Flip.js (runtime) but flip.d.ts (types); suppressing the program-level
// TS1149 casing collision needs ts-ignore — the expect-error variant is reported unused.
// biome-ignore lint/suspicious/noTsIgnore: see above
// @ts-ignore
import { Flip } from "gsap/Flip";
import { type RefObject, useCallback, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(Flip);

const FLIP_SELECTOR = "[data-flip-id]";
/** Visual props that differ between a shared element's appearances. */
const FLIP_PROPS = "opacity,borderColor,borderWidth,borderRadius,boxShadow,backgroundColor";

/**
 * Links stages together: elements with the same `data-flip-id` in the outgoing
 * and incoming stage morph from one to the other (GSAP Flip), and everything
 * else in the incoming stage fades in around them.
 *
 * Call the returned `capture()` right before changing `step`; the morph runs
 * once the new stage has rendered. With reduced motion, stages swap instantly.
 */
export function useStageFlip(
	rootRef: RefObject<HTMLElement | null>,
	step: number,
	reduceMotion: boolean,
) {
	const pending = useRef<ReturnType<typeof Flip.getState> | null>(null);
	const running = useRef<gsap.core.Timeline | null>(null);

	const capture = useCallback(() => {
		const root = rootRef.current;
		if (!root || reduceMotion) return;
		// Record where shared elements are right now (mid-morph included), then stop.
		pending.current = Flip.getState(root.querySelectorAll(FLIP_SELECTOR), { props: FLIP_PROPS });
		running.current?.kill();
	}, [rootRef, reduceMotion]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: runs once per stage change
	useLayoutEffect(() => {
		const root = rootRef.current;
		const state = pending.current;
		pending.current = null;
		if (!root || reduceMotion) return;

		const tl = gsap.timeline();
		if (state) {
			tl.add(
				Flip.from(state, {
					targets: root.querySelectorAll(FLIP_SELECTOR),
					duration: 0.7,
					ease: "power3.inOut",
					nested: true,
					props: FLIP_PROPS,
					onEnter: (els: Element[]) =>
						gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.2 }),
				}),
				0,
			);
		}
		tl.fromTo(
			fadeTargets(root),
			{ opacity: 0, y: 8 },
			{ opacity: 1, y: 0, duration: 0.35, stagger: 0.015, clearProps: "opacity,transform" },
			state ? 0.2 : 0,
		);
		running.current = tl;
		return () => {
			tl.kill();
		};
	}, [step]);

	return capture;
}

/**
 * The largest subtrees of `el` that contain no shared element, so they can fade
 * without touching anything Flip is moving.
 */
function fadeTargets(el: Element): Element[] {
	const out: Element[] = [];
	for (const child of Array.from(el.children)) {
		if (child.hasAttribute("data-flip-id")) continue;
		if (child.querySelector(FLIP_SELECTOR)) out.push(...fadeTargets(child));
		else out.push(child);
	}
	return out;
}
