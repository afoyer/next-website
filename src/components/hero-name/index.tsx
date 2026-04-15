"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHeroStore } from "@/store/hero";

const CHARS = ["a", "y", "m", "e", "r", "i", "c", " ", "f", "o", "y", "e", "r"];
const FONTS = [
  "helvetica-neue-lt-pro, sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
  "Impact, sans-serif",
  "'Times New Roman', serif",
  "serif",
];
const ANIM_PLAYED_KEY = "hero-anim-played";

function glitchSpan(span: HTMLSpanElement, originalChar: string) {
  const font = FONTS[Math.floor(Math.random() * FONTS.length)];
  const rand = Math.random();
  const char =
    rand < 0.33
      ? originalChar.toUpperCase()
      : rand < 0.66
        ? originalChar.toLowerCase()
        : originalChar;
  span.style.fontFamily = font;
  span.textContent = char;
}

export default function HeroName() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>(CHARS.map(() => null));
  const setHeroLogoVisible = useHeroStore((s) => s.setHeroLogoVisible);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || sessionStorage.getItem(ANIM_PLAYED_KEY)) {
      // Skip animation — show logo immediately
      if (textGroupRef.current) gsap.set(textGroupRef.current, { opacity: 0 });
      if (svgRef.current) gsap.set(svgRef.current, { opacity: 1 });
      return;
    }

    // Phase 1: per-character glitch at ~15fps for 1.2s
    const glitchInterval = setInterval(() => {
      charRefs.current.forEach((span, i) => {
        if (!span || CHARS[i] === " ") return;
        glitchSpan(span, CHARS[i]);
      });
    }, 1000 / 15);

    const tl = gsap.timeline();

    // Stop glitch after 1.2s
    tl.addLabel("glitchDone", 1.2);
    tl.call(() => clearInterval(glitchInterval), [], "glitchDone");

    // Phase 2: settle each character left-to-right — uniform 45ms stagger
    let letterIdx = 0;
    CHARS.forEach((char, i) => {
      if (char === " ") return;
      const idx = letterIdx;
      tl.call(
        () => {
          const span = charRefs.current[i];
          if (!span) return;
          span.style.fontFamily = "helvetica-neue-lt-pro, sans-serif";
          span.textContent = char.toLowerCase();
        },
        [],
        `glitchDone+=${idx * 0.045}`
      );
      letterIdx++;
    });

    // Brief pause after all chars settled (12 chars × 45ms = 540ms → settled at ~1.94s)
    tl.addLabel("settled", "+=0.2");

    // Phase 3: fade non-initials, drift "a" (index 0) and "f" (index 8) apart
    const nonInitialIndices = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
    nonInitialIndices.forEach((i) => {
      const span = charRefs.current[i];
      if (span) tl.to(span, { opacity: 0, duration: 0.3 }, "settled");
    });

    tl.to(charRefs.current[0], { x: -40, duration: 0.4, ease: "power2.out" }, "settled");
    tl.to(charRefs.current[8], { x: 40, duration: 0.4, ease: "power2.out" }, "settled");

    // Phase 4: converge toward center and scale up
    tl.addLabel("converge", "+=0.1");
    tl.to(
      [charRefs.current[0], charRefs.current[8]],
      { x: 0, scale: 2.5, duration: 0.6, ease: "power2.inOut" },
      "converge"
    );

    // Phase 5: cross-fade text group out, SVG logo in (overlap by 0.1s)
    tl.addLabel("crossfade", "-=0.1");
    tl.to(textGroupRef.current, { opacity: 0, duration: 0.5 }, "crossfade");
    tl.to(svgRef.current, { opacity: 1, duration: 0.5 }, "crossfade");

    // Mark animation as played so it doesn't repeat this session
    tl.call(() => {
      sessionStorage.setItem(ANIM_PLAYED_KEY, "1");
    });

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div ref={heroRef} className="relative flex items-center justify-center">
      <div ref={textGroupRef} className="flex items-baseline text-2xl font-bold">
        {CHARS.map((char, i) =>
          char === " " ? (
            <span key={i} ref={(el) => { charRefs.current[i] = el; }}>&nbsp;</span>
          ) : (
            <span key={i} ref={(el) => { charRefs.current[i] = el; }}>
              {char}
            </span>
          )
        )}
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 271 158"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{ opacity: 0, height: "2.5em", width: "auto" }}
      >
        <path
          d="M0.180369 156.43C-0.280135 157.093 0.194403 158 1.00173 158H26.8251L38.9084 143.939C39.2599 143.53 39.7151 143.224 40.2262 143.051L105.483 121.074C106.779 120.638 108.121 121.602 108.121 122.969V158H118.09V1H108.644C108.316 1 108.009 1.16049 107.823 1.42959L0.180369 156.43ZM97.2264 98.2205C97.2265 98.6442 96.9596 99.022 96.5602 99.1634L51.9974 114.942C51.0941 115.262 50.3016 114.25 50.828 113.45L95.3778 45.6772C95.923 44.8478 97.2132 45.2336 97.2134 46.2263L97.2264 98.2205Z"
          fill="var(--foreground)"
        />
        <path
          d="M118.09 1.11L270.09 0L237.613 29H150.42V69H192.057L169.524 99H150.42V158H118.09"
          fill="var(--foreground)"
        />
        <path d="M192.057 69L169.524 99H198.425L220.259 69H192.057Z" fill="var(--foreground)" />
      </svg>
    </div>
  );
}
