'use client';

import { useRef } from 'react';
import './page.scss';
import PantonifyCard from './components/PantonifyCard';
import PantonifySideText from './components/PantonifySideText';
import PantonifySwatch from './components/PantonifySwatch';
import { usePantonifyScroll } from './hooks/usePantonifyScroll';

export default function Pantonify() {
  const sectionRef      = useRef<HTMLElement>(null);
  const cardRef         = useRef<HTMLDivElement>(null);
  const cardSceneRef    = useRef<HTMLDivElement>(null);
  const cardInnerRef    = useRef<HTMLDivElement>(null);
  const backRef         = useRef<HTMLDivElement>(null);
  const sideTextRef     = useRef<HTMLDivElement>(null);
  // Mobile-only: separate element animated by the mobile scroll branch.
  // Hidden on desktop via CSS. Lives outside the 3D card so the flip
  // structure is never touched on mobile.
  const mobileSwatchRef = useRef<HTMLDivElement>(null);

  usePantonifyScroll({
    sectionRef,
    cardRef,
    cardSceneRef,
    cardInnerRef,
    backRef,
    sideTextRef,
    mobileSwatchRef,
  });

  return (
    <section ref={sectionRef} className="pantonify-section">
      <PantonifySideText ref={sideTextRef} />
      <PantonifyCard refs={{ cardRef, cardSceneRef, cardInnerRef, backRef }} />
      {/* Mobile swatch overlay — GSAP starts this below the viewport
          and slides it up to y:0 (overlaying the full section).
          Hidden on desktop via .mobile-swatch-wrapper { display: none }. */}
      <div ref={mobileSwatchRef} className="mobile-swatch-wrapper">
        <PantonifySwatch />
      </div>
    </section>
  );
}
