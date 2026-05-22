import { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SPIN_UNITS = 2; // Pin duration multiplier

interface SpinClasses {
  section: string;
  pageWrapper: string;
  browser: string
}

export function useSpinObserver(sectionRef: RefObject<HTMLDivElement | null>, classes: SpinClasses) {

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 800px)", () => {
      const section = sectionRef.current;
      if (!section) return;

      // 1. SELECTORS & TYPE CASTING (Fixes ts2322)
      const card = section.querySelector<HTMLElement>(`.${classes.section}:first-child`);

      const browser = section.querySelector<HTMLElement>(`.${classes.browser}`);
      const cardWrapper = section.querySelector<HTMLElement>(`.${classes.pageWrapper}`);
      
      if (!card || !cardWrapper) return;
      // 3. THE MAIN TIMELINE (Your specific scaling/positioning logic)
      const masterTl = gsap.timeline();

      // Only tween the inner wrapper — never the section element itself.
      // Tweening height/width/x/y on the pinned section breaks ScrollTrigger's
      // spacer calculations: at pin-end (scrollY ≈ vh) the section is back in
      // normal flow at its original offsetTop but visually shifted, so it ends
      // up entirely above the viewport and appears to vanish.
      masterTl.to(cardWrapper, {
        scale: 0.5,
        ease: 'power2.inOut',
        duration: SPIN_UNITS,
      });
      masterTl.to(browser, {
        borderRadius: 10,
        ease: 'power2.inOut',
        duration: SPIN_UNITS,
      }, '<');



      // 4. TRIGGER 1: THE PIN
      ScrollTrigger.create({
        trigger: cardWrapper as gsap.DOMTarget,
        start: 'top top',
        end: "+=100%",
        pin: true,
        scrub: 0.1,
        animation: masterTl,
        // Higher priority ensures the pin spacer is calculated first
        refreshPriority: 1,
        fastScrollEnd: true,

      });
    })




  }, { scope: sectionRef });
}