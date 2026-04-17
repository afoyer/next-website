'use client';

import { forwardRef } from 'react';

// forwardRef lets the parent attach a ref to this component's root DOM node.
// GSAP in usePantonifyScroll fades this element in during timeline 1.
const PantonifySideText = ({ children, ref, className }: { children: React.ReactNode; ref: React.Ref<HTMLDivElement>; className?: string }) => {
  return (
    // The `pantonify-side-text` class sets opacity: 0 in SCSS —
    // GSAP takes over from there.
    <div ref={ref} className={`pantonify-side-text${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

export default PantonifySideText;
