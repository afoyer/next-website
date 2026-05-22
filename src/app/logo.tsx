"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// @ts-ignore - GSAP Flip case sensitivity issue on macOS
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export default function Logo({className}: {className?: string}) {
  useGSAP(() => {
    const state = Flip.getState(".af-logo", ".af-nav-logo");
    Flip.from(state, { duration: 1, ease: "power2.inOut" });
  });
  return (
    <img
      src="/af.svg"
      className={`h-full w-full af-logo ${className || ''}`}
      alt="AF Logo"
    />
  );
}
