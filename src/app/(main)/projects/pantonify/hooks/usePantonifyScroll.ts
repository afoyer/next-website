'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { RefObject, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export interface PantonifyScrollRefs {
  sectionRef: RefObject<HTMLElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  cardSceneRef: RefObject<HTMLDivElement | null>;
  cardInnerRef: RefObject<HTMLDivElement | null>;
  backRef: RefObject<HTMLDivElement | null>;
  sideTextRef: RefObject<HTMLDivElement | null>;
  swatchTextRef: RefObject<HTMLDivElement | null>;
  mobileSwatchRef: RefObject<HTMLDivElement | null>;
  swatchInfoOverlayRef: RefObject<HTMLDivElement | null>;
}

export function usePantonifyScroll(refs: PantonifyScrollRefs) {
  const {
    sectionRef, cardRef, cardSceneRef, cardInnerRef,
    backRef, sideTextRef, mobileSwatchRef, swatchTextRef,
    swatchInfoOverlayRef,
  } = refs;

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
      const swatchText = swatchTextRef.current;

      if (!section || !card || !cardScene || !cardInner || !back || !sideText || !swatchText) return;

      const mm = gsap.matchMedia();

      // ─────────────────────────────────────────────
      // DESKTOP (≥768px)
      // Three phases chained via a timelines array.
      // end is derived from timelines.length — no magic percentages.
      // ─────────────────────────────────────────────
      mm.add('(min-width: 768px)', () => {

        // — Timeline 1: slide card right + fade side text —
        const tl1 = gsap.timeline();

        tl1
          .to(card, {
            x: () => section.offsetWidth * 0.25,
            ease: 'power2.inOut',
            duration: 1,
          })
          .fromTo(
            sideText,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, ease: 'power2.out', duration: 1 },
            '<'
          )
          .fromTo(
            section,
            { backgroundColor: '#009011' },
            { backgroundColor: '#1e1e1e', ease: 'power2.in' },
            '<'
          );

        // — Timeline 2: flip + expand height + re-center —
        gsap.set(cardScene, { height: () => cardScene.offsetHeight });
        // Scale origin for tl3: card zooms from its top-center so the header
        // stays anchored while the bottom expands downward into the clip region.
        gsap.set(cardScene, { transformOrigin: 'top center' });

        const tl2 = gsap.timeline();

        tl2
          .fromTo(
            sideText,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -20, ease: 'power2.out', duration: 1 },
          )
          .fromTo(
            swatchText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
            '<'
          )
          .to(cardInner, { rotateY: 180, ease: 'power2.inOut', duration: 1 }, '<')
          .to(cardScene, { height: () => back.scrollHeight, ease: 'power2.inOut', duration: 1 }, '<')
          .to(card, { x: 0, ease: 'power2.inOut', duration: 1 }, '<');

        // — Timeline 3: fade swatchText + expand card to 80vw, anchored at top —
        // The y tween moves cardScene to the top of the section so the card
        // grows downward and the bottom clips at the section boundary.
        gsap.set(back.querySelector('.swatch-steps'), { opacity: 0 });
        const tl3 = gsap.timeline();

        tl3
          .to(swatchText, { opacity: 0, y: -20, ease: 'power2.out', duration: 1 })
          // Scale the entire cardScene uniformly so text and layout stay proportional.
          // transformOrigin 'top center' keeps the header visible; section overflow:hidden clips the bottom.
          .to(cardScene, {
            scale: () => (section.offsetWidth * 0.8) / cardScene.offsetWidth,
            ease: 'power2.inOut',
            duration: 1,
          }, '<')
          .fromTo(
            back.querySelector('.swatch-steps'),
            { opacity: 0 },
            { opacity: 1, ease: 'power2.out', duration: 0.6 },
            '-=0.3'
          );

        // Array-driven master timeline — end derived from length, no magic numbers.
        const timelines = [tl1, tl2, tl3];
        const masterTl = gsap.timeline();
        timelines.forEach(tl => masterTl.add(tl));

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${timelines.length * 100}%`,
          pin: true,
          scrub: 1,
          animation: masterTl,
          invalidateOnRefresh: true,
        });
      });

      // ─────────────────────────────────────────────
      // MOBILE (≤767px)
      // Three phases: swatch slides in → swatch text → overlay fades up.
      // Same array pattern — end derived from timelines.length.
      // ─────────────────────────────────────────────
      mm.add('(max-width: 767px)', () => {
        const mobileSwatch = mobileSwatchRef.current;
        const swatchInfoOverlay = swatchInfoOverlayRef.current;
        if (!mobileSwatch || !swatchInfoOverlay) return;

        gsap.set(sideText, { opacity: 1, x: 0 });
        gsap.set(mobileSwatch, { y: () => section.offsetHeight });
        gsap.set(swatchInfoOverlay, { opacity: 0, y: 30 });
        // swatchText starts hidden on mobile — GSAP overrides the CSS opacity:1
        gsap.set(swatchText, { opacity: 0, y: 20 });

        // Phase 1: front group slides up, swatch slides in
        const tl = gsap.timeline();
        tl
          .to([card, sideText], {
            y: () => -section.offsetHeight,
            ease: 'power2.inOut',
            duration: 1,
          })
          .to(mobileSwatch, {
            y: 0,
            ease: 'power2.inOut',
            duration: 1,
          }, '<');

        // Phase 2: swatch text fades in centered over the swatch
        const tlSwatchText = gsap.timeline();
        tlSwatchText
          .fromTo(
            swatchText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }
          );

        // Phase 3: swatch text fades out, info overlay fades up
        const tlOverlay = gsap.timeline();
        tlOverlay
          .to(swatchText, { opacity: 0, y: -20, ease: 'power2.out', duration: 0.5 })
          .to(swatchInfoOverlay, {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 1,
          }, '<');

        const timelines = [tl, tlSwatchText, tlOverlay];
        const masterTl = gsap.timeline();
        timelines.forEach(t => masterTl.add(t));

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${timelines.length * 100}%`,
          pin: true,
          scrub: 1,
          animation: masterTl,
          invalidateOnRefresh: true,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );
}
