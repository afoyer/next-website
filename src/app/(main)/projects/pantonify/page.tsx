'use client';

import { useRef } from 'react';
import './page.scss';
import PantonifyCard from './components/PantonifyCard';
import PantonifySideText from './components/PantonifySideText';
import PantonifySwatch from './components/PantonifySwatch';
import { usePantonifyScroll } from './hooks/usePantonifyScroll';
import { PANTONIFY_STEPS } from './constants';

export default function Pantonify() {
  const sectionRef = useRef<HTMLElement>(null);

  usePantonifyScroll(sectionRef);

  return (
    <section ref={sectionRef} className="pantonify-section">
      <PantonifySideText>
        <h2>Inspiration</h2>
        <p>
          People love tracking and sharing the music they have been listening to as Spotify Wrapped continues to be a cultural phenomenon every year it releases.
        </p>
        <p>
          The goal of this project was to allow a more condensed feel of sharing what one has been listening to on smaller periods of time
          ("What have you been listening to this month?")
          while giving showcasing one&apos;s uniqueness through color.
        </p>
      </PantonifySideText>
      <PantonifySideText className="pantonify-side-text--swatch">
        <h2>Swatch Card</h2>
        <div className="swatch-subtext">
          <p>Each color swatch is generated from your album art&apos;s dominant hue.</p>
          <p>Matched to the closest Pantone® shade for a shareable, print-ready card.</p>
        </div>
      </PantonifySideText>
      <PantonifyCard />
      <div className="mobile-swatch-wrapper">
        <PantonifySwatch />
      </div>
      {/* Overlay is a sibling of the wrapper, positioned relative to the section.
          This prevents it from being clipped when GSAP translates the wrapper down. */}
      <div className="swatch-info-overlay">
        <div className="swatch-info-overlay__steps">
          {PANTONIFY_STEPS.map((label, i) => (
            <span key={i} className="swatch-info-overlay__item">
              <span className="swatch-info-overlay__badge">{i + 1}</span>
              <span className="swatch-info-overlay__label">{label}</span>
              {i < PANTONIFY_STEPS.length - 1 && (
                <span className="swatch-info-overlay__arrow">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
