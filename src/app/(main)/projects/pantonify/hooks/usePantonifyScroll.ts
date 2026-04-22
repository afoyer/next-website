'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { RefObject, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function usePantonifyScroll(sectionRef: RefObject<HTMLElement | null>) {
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
      if (!section) return;

      // Scoped querySelector — finds elements inside the section by CSS class.
      // This replaces the previous multi-ref pattern so callers only need sectionRef.
      const q = <T extends HTMLElement = HTMLElement>(sel: string) =>
        section.querySelector<T>(sel);

      const card      = q('.pantonify-card-wrapper'); // outer wrapper (GSAP slides X)
      const cardScene = q('.card-scene');              // perspective wrapper
      const cardInner = q('.card-inner');              // rotating wrapper
      const back      = q('.card-back');               // back face (scrollHeight for tl2)
      const sideText  = q('.pantonify-side-text:not(.pantonify-side-text--swatch)');
      const swatchText = q('.pantonify-side-text--swatch');

      if (!card || !cardScene || !cardInner || !back || !sideText || !swatchText) return;

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

        // — Timeline 2b: crossfade swatchText sub-paragraphs —
        // p[0] fades out, p[1] fades in while h2 stays visible.
        const swatchPs = swatchText.querySelectorAll<HTMLElement>('.swatch-subtext p');
        if (swatchPs.length >= 2) gsap.set(swatchPs[1], { opacity: 0 });

        const tl2b = gsap.timeline();
        if (swatchPs.length >= 2) {
          tl2b
            .to(swatchPs[0], { opacity: 0, ease: 'power2.out', duration: 0.5 })
            .to(swatchPs[1], { opacity: 1, ease: 'power2.out', duration: 0.5 }, '<');
        }

        // — Timeline 3: fade swatchText + scale card to 80vw, anchored at top —
        // swatch-steps removed — song info rows are always visible in the new layout.
        const tl3 = gsap.timeline();

        tl3
          .to(swatchText, { opacity: 0, y: -20, ease: 'power2.out', duration: 1 })
          // Scale the entire cardScene uniformly so text and layout stay proportional.
          // transformOrigin 'top center' keeps the header visible; section overflow:hidden clips the bottom.
          // At ~2x scale the swatch inner-text (11px) becomes ~22px — readable, matching 364-9.
          .to(cardScene, {
            scale: () => (section.offsetWidth * 0.8) / cardScene.offsetWidth,
            ease: 'power2.inOut',
            duration: 1,
          }, '<')
          .to(cardScene, { y: 100, ease: 'power2.in', duration: 1 }, '<'); 

        // Array-driven master timeline — end derived from length, no magic numbers.
        const timelines = [tl1, tl2, tl2b, tl3];
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
      // Layout: card is the only in-flow flex child; both text blocks are
      // position:absolute anchored at top 6% so they share the top-20% zone.
      // The overlay is a sibling of the wrapper (relative to section), so it
      // is never clipped when the wrapper is GSAP-translated downward.
      //
      // Phase 1 — card slides off top, swatch slides up to cover bottom 80%.
      //           Top zone is empty (both texts are opacity:0).
      // Phase 2 — sideText (Inspiration) fades into the top-20% zone.
      // Phase 3 — sideText fades out, swatchText fades in (same zone).
      // Phase 4 — swatchText fades out, gradient overlay fades up.
      // ─────────────────────────────────────────────
      mm.add('(max-width: 767px)', () => {
        const mobileSwatch      = q('.mobile-swatch-wrapper');
        const swatchInfoOverlay = q('.swatch-info-overlay');
        if (!mobileSwatch || !swatchInfoOverlay) return;

        // Both texts start hidden — CSS sets opacity:0, GSAP reinforces it so
        // scrub resets cleanly on refresh/resize.
        gsap.set(sideText,          { opacity: 0, y: 0 });
        gsap.set(swatchText,        { opacity: 0, y: 0 });
        gsap.set(mobileSwatch,      { y: () => section.offsetHeight });
        gsap.set(swatchInfoOverlay, { opacity: 0, y: 30 });

        // — Phase 1: card exits top, swatch covers bottom 80% —
        const tl1 = gsap.timeline();
        tl1
          .to(card, {
            y: () => -section.offsetHeight,
            ease: 'power2.inOut',
            duration: 1,
          })
          .to(mobileSwatch, {
            // y = 20% → swatch top sits at the 20% mark, bottom 80% is covered.
            // section overflow:hidden clips everything below.
            y: () => section.offsetHeight * 0.2,
            ease: 'power2.inOut',
            duration: 1,
          }, '<');

        // — Phase 2: Inspiration text fades into the top-20% zone —
        const tl2 = gsap.timeline();
        tl2.fromTo(
          sideText,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
        );

        // — Phase 3: sideText → swatchText crossfade in the same zone —
        const tl3 = gsap.timeline();
        tl3
          .to(sideText, { opacity: 0, y: -10, ease: 'power2.out', duration: 0.5 })
          .fromTo(
            swatchText,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 },
            '<'
          );

        // — Phase 4: swatchText fades out, gradient overlay fades up —
        const tl4 = gsap.timeline();
        tl4
          .to(swatchText, { opacity: 0, y: -10, ease: 'power2.out', duration: 0.5 })
          .to(swatchInfoOverlay, {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.8,
          }, '<');

        const timelines = [tl1, tl2, tl3, tl4];
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
