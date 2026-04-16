'use client';

import { forwardRef } from 'react';

// forwardRef lets the parent attach a ref to this component's root DOM node.
// GSAP in usePantonifyScroll fades this element in during timeline 1.
const PantonifySideText = forwardRef<HTMLDivElement>(function PantonifySideText(_, ref) {
  return (
    // The `pantonify-side-text` class sets opacity: 0 in SCSS —
    // GSAP takes over from there.
    <div ref={ref} className="pantonify-side-text">
      <h2>A color to remember</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation.
      </p>
    </div>
  );
});

export default PantonifySideText;
