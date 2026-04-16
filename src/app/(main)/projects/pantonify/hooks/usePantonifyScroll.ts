'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export interface PantonifyScrollRefs {
  sectionRef:       RefObject<HTMLElement | null>;      // pinned container
  cardRef:          RefObject<HTMLDivElement | null>;   // x-translated (desktop) / y-translated (mobile)
  cardSceneRef:     RefObject<HTMLDivElement | null>;   // height tweened during desktop tl2
  cardInnerRef:     RefObject<HTMLDivElement | null>;   // rotateY tweened during desktop tl2
  backRef:          RefObject<HTMLDivElement | null>;   // natural height measured on desktop
  sideTextRef:      RefObject<HTMLDivElement | null>;   // faded in (desktop) / slid up (mobile)
  mobileSwatchRef:  RefObject<HTMLDivElement | null>;   // overlay slid in from below (mobile only)
}

export function usePantonifyScroll(refs: PantonifyScrollRefs) {
  const {
    sectionRef, cardRef, cardSceneRef, cardInnerRef,
    backRef, sideTextRef, mobileSwatchRef,
  } = refs;

  useGSAP(
    () => {
      const section    = sectionRef.current;
      const card       = cardRef.current;
      const cardScene  = cardSceneRef.current;
      const cardInner  = cardInnerRef.current;
      const back       = backRef.current;
      const sideText   = sideTextRef.current;

      // Shared guard — elements required by both branches.
      if (!section || !card || !cardScene || !cardInner || !back || !sideText) return;

      const mm = gsap.matchMedia();

      // ─────────────────────────────────────────────
      // DESKTOP  (≥768px)
      // Two stacked pinned ScrollTriggers that chain automatically.
      // GSAP resolves ST2's `start: 'top top'` to after ST1's pin spacer.
      // ─────────────────────────────────────────────
      mm.add('(min-width: 768px)', () => {

        // — Timeline 1: slide card right + fade side text —
        // `pin: true` is required here so ST2 starts after ST1 ends.
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

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,           // ← required for sequential chaining with ST2
          scrub: 1,
          animation: tl1,
          invalidateOnRefresh: true,
        });

        // — Timeline 2: flip + expand + re-center —
        // `x: 0` reverses the tl1 offset so the swatch lands in screen center.
        gsap.set(cardScene, { height: () => cardScene.offsetHeight });

        const tl2 = gsap.timeline();

        tl2
          .to(cardInner, { rotateY: 180, ease: 'power2.inOut', duration: 1 })
          .to(cardScene, { height: () => back.scrollHeight, ease: 'power2.inOut', duration: 1 }, '<')
          .to(card,      { x: 0,         ease: 'power2.inOut', duration: 1 }, '<');

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
          animation: tl2,
          invalidateOnRefresh: true,
        });
      });

      // ─────────────────────────────────────────────
      // MOBILE  (≤767px)
      // Single pinned ScrollTrigger: front group slides up, swatch slides in.
      // No 3D transforms — the 3D card structure is untouched.
      // matchMedia cleanup resets inline styles automatically on resize.
      // ─────────────────────────────────────────────
      mm.add('(max-width: 767px)', () => {
        const mobileSwatch = mobileSwatchRef.current;
        if (!mobileSwatch) return;

        // Side text is always visible on mobile (no fade-in).
        gsap.set(sideText,     { opacity: 1, x: 0 });
        // Push swatch overlay exactly one section-height below the viewport.
        // Function syntax so GSAP re-evaluates after resize/orientation change.
        gsap.set(mobileSwatch, { y: () => section.offsetHeight });

        const tl = gsap.timeline();

        tl
          // Front group (card + side text) slides up together.
          .to([card, sideText], {
            y: () => -section.offsetHeight,
            ease: 'power2.inOut',
            duration: 1,
          })
          // Swatch overlay slides up from below simultaneously.
          .to(mobileSwatch, {
            y: 0,
            ease: 'power2.inOut',
            duration: 1,
          }, '<');

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          animation: tl,
          invalidateOnRefresh: true,
        });
      });
    },
    { scope: sectionRef }
  );
}
