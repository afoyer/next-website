"use client";
import { useEffect, useRef } from "react";
import { registerTransitionElements } from "@/lib/page-transition";

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && blurRef.current && bgRef.current && labelRef.current) {
      registerTransitionElements(
        containerRef.current,
        blurRef.current,
        bgRef.current,
        labelRef.current
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] pointer-events-none">
      {/* blur layer */}
      <div ref={blurRef} className="absolute inset-0 opacity-0" />
      {/* solid bg layer */}
      <div ref={bgRef} className="absolute inset-0 bg-foreground opacity-0" />
      {/* text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span ref={labelRef} className="text-background text-2xl font-medium opacity-0" />
      </div>
    </div>
  );
}
