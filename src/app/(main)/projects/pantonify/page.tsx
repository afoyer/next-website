'use client';

import { useRef } from 'react';
import './page.scss';
import PantonifyCard from './components/PantonifyCard';
import PantonifySideText from './components/PantonifySideText';
import { usePantonifyScroll } from './hooks/usePantonifyScroll';

export default function Pantonify() {
  // Refs for the scroll hook. Each one targets a specific DOM node —
  // see usePantonifyScroll for what each ref drives.
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardSceneRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const sideTextRef = useRef<HTMLDivElement>(null);

  usePantonifyScroll({
    sectionRef,
    cardRef,
    cardSceneRef,
    cardInnerRef,
    backRef,
    sideTextRef,
  });

  return (
    // `pantonify-section` is the element ScrollTrigger pins.
    // It must be full-viewport height — GSAP uses this to calculate
    // how much space to reserve when pinning.
    <section ref={sectionRef} className="pantonify-section">
      <PantonifySideText ref={sideTextRef} />
      <PantonifyCard
        refs={{ cardRef, cardSceneRef, cardInnerRef, backRef }}
      />
    </section>
  );
}
