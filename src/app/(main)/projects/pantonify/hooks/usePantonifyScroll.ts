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

  const lenis = useLenis(({ scroll }) => {
    void scroll;
    ScrollTrigger.update();
  });

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

      if (!section || !card || !cardScene || !cardInner || !back || !sideText) return;

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
        gsap.set(cardScene, { width: () => cardScene.offsetWidth });

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

        // — Timeline 3: fade swatchText + expand card to 80vw —
        const tl3 = gsap.timeline();

        tl3
          .to(swatchText, { opacity: 0, y: -20, ease: 'power2.out', duration: 1 })
          .to(cardScene, { width: '80vw', ease: 'power2.inOut', duration: 1 }, '<')
          .to(cardScene, { height: () => back.scrollHeight, ease: 'power2.inOut', duration: 1 }, '<');

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
      // Two phases: swatch slides in, then overlay fades up.
      // Same array pattern — end derived from timelines.length.
      // ─────────────────────────────────────────────
      mm.add('(max-width: 767px)', () => {
        const mobileSwatch = mobileSwatchRef.current;
        const swatchInfoOverlay = swatchInfoOverlayRef.current;
        if (!mobileSwatch || !swatchInfoOverlay) return;

        gsap.set(sideText, { opacity: 1, x: 0 });
        gsap.set(mobileSwatch, { y: () => section.offsetHeight });
        gsap.set(swatchInfoOverlay, { opacity: 0, y: 30 });

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

        // Phase 2: overlay fades up over the swatch
        const tlOverlay = gsap.timeline();
        tlOverlay
          .to(swatchInfoOverlay, {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 1,
          });

        const timelines = [tl, tlOverlay];
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
