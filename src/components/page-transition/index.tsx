"use client";
import { useEffect, useRef } from "react";
import { registerTransitionElements, TRANSITION_CONFIG } from "@/lib/page-transition";

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && bgRef.current && labelRef.current) {
      registerTransitionElements(
        containerRef.current,
        bgRef.current,
        labelRef.current
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Dark circle overlay — GSAP drives clipPath on this element */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--nav-bg)",
          opacity: TRANSITION_CONFIG.overlayOpacity,
          clipPath: "circle(0% at 50% 50%)",
        }}
      />
      {/* Destination label — sibling to bgRef so it renders above the circle */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span
          ref={labelRef}
          className="text-[color:var(--nav-icon)] text-2xl font-medium uppercase tracking-widest opacity-0 select-none"
        />
      </div>
    </div>
  );
}
