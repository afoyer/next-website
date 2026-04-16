'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { RefObject, useEffect } from 'react';

// Register ScrollTrigger once. GSAP silently ignores duplicate registrations,
// so this is safe to call in a hook (won't break if called multiple times).
gsap.registerPlugin(ScrollTrigger);

export interface PantonifyScrollRefs {
  sectionRef: RefObject<HTMLElement | null>;      // pinned container
  cardRef: RefObject<HTMLDivElement | null>;      // x-translated during tl1
  cardSceneRef: RefObject<HTMLDivElement | null>; // height tweened during tl2
  cardInnerRef: RefObject<HTMLDivElement | null>; // rotateY tweened during tl2
  backRef: RefObject<HTMLDivElement | null>;      // natural height measured on mount
  sideTextRef: RefObject<HTMLDivElement | null>;  // faded in during tl1
}

export function usePantonifyScroll(refs: PantonifyScrollRefs) {
  const { sectionRef, cardRef, cardSceneRef, cardInnerRef, backRef, sideTextRef } = refs;

  // Lenis smooth scroll intercepts native scroll events, so ScrollTrigger
  // won't detect scroll on its own. We connect them by updating ScrollTrigger
  // on every Lenis scroll tick.
  const lenis = useLenis(({ scroll }) => {
    void scroll; // suppress unused-var lint
    ScrollTrigger.update();
  });

  // Also connect the GSAP ticker to Lenis so they share the same animation loop.
  // Without this, Lenis and GSAP can fight over requestAnimationFrame timing.
  useEffect(() => {
    if (!lenis) return;
    const handler = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(handler);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(handler);
  }, [lenis]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const card = cardRef.current;
      const cardScene = cardSceneRef.current;
      const cardInner = cardInnerRef.current;
      const back = backRef.current;
      const sideText = sideTextRef.current;

      // Guard — if any ref is missing the hook bails out silently.
      // This prevents crashes during SSR or before the DOM is ready.
      if (!section || !card || !cardScene || !cardInner || !back || !sideText) return;

      // --- Timeline 1: slide card right, fade in side text ---
      //
      // The card x-translation puts it in the right half of the section.
      // We compute it at animation time (inside useGSAP) so it's always
      // based on the current layout, not a stale mount value.
      const tl1 = gsap.timeline();

      tl1
        // Move card into the right half. `'<'` means "with previous" —
        // both tweens run in parallel starting at position 0 of the timeline.
        .to(card, {
          x: () => section.offsetWidth * 0.25,
          ease: 'power2.inOut',
          duration: 1,
        })
        // Fade side text in simultaneously.
        // `'<'` is shorthand for "at the same time as the previous tween".
        .fromTo(
          sideText,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, ease: 'power2.out', duration: 1 },
          '<'
        );

      // ScrollTrigger 1: pin the section and scrub tl1 over 100vh of scroll.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',       // adds 100vh of scrollable distance
        pin: true,
        scrub: 1,            // 1 = slight smoothing (feels less robotic than `true`)
        animation: tl1,
        invalidateOnRefresh: true, // recalculate x on window resize
      });

      // --- Timeline 2: flip card, tween container height ---
      //
      // The back face is pre-rotated 180deg in CSS. When cardInner reaches
      // rotateY(180), the front face has rotated away (hidden by backface-visibility)
      // and the back face rotates into view.
      //
      // We also tween cardScene's height from the front face's rendered height
      // to the back face's natural scrollHeight. This lets the back card be
      // any height without overflowing.
      // Use function syntax so GSAP re-evaluates these on invalidateOnRefresh.
      // Static numbers would be stale after a window resize.
      gsap.set(cardScene, { height: () => cardScene.offsetHeight });

      const tl2 = gsap.timeline();

      tl2
        .to(cardInner, {
          rotateY: 180,
          ease: 'power2.inOut',
          duration: 1,
        })
        .to(
          cardScene,
          {
            height: () => back.scrollHeight,
            ease: 'power2.inOut',
            duration: 1,
          },
          '<' // run simultaneously with the flip
        );

      // ScrollTrigger 2: continues where ST1 left off.
      // GSAP stacks pins on the same element automatically — ST2's
      // `start: 'top top'` resolves to the scroll position after ST1's
      // pin spacer, so it fires exactly when ST1 finishes.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        animation: tl2,
        invalidateOnRefresh: true,
      });
    },
    { scope: sectionRef } // useGSAP cleans up all GSAP context when component unmounts
  );
}
