"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export const preloaderTime = 3;

export default function Preloader() {
  const path = usePathname();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);
  const [isVisible, setIsVisible] = useState(path !== "/"); // Show preloader only on the first load (home page)

  useGSAP(() => {
    if (hasPlayed.current) {
      gsap.set(".preloader", { height: 121 });
      gsap.set(".preloader-content", { opacity: 1 });
      gsap.set(".logo", { clipPath: "inset(0% 0% 0% 0%)" });
    } else {
      hasPlayed.current = true;

      const tl = gsap.timeline();
      tl.fromTo(
        ".preloader-content",
        {
          opacity: 0,
          duration: preloaderTime/8,
        },
        {
          opacity: 1,
          duration: preloaderTime/8,
          ease: "power2.inOut",
        },
      );
      tl.fromTo(
        ".logo",
        {
          clipPath: "inset(100% 100% 100% 100%)",
          ease: "expo.out",
        },
        {
          duration: preloaderTime/8,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut",
        },
      );
      if (window.innerWidth < 640) {
        tl.to(".preloader", {
          opacity: 0,
          height: 0,
          duration: preloaderTime/8,
          delay: preloaderTime/4,
          ease: "power2.inOut",
        });
      } else {
        tl.fromTo(
          ".preloader",
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut",
          },
          {
            clipPath: "inset(100% 100% 100% 100%)",
            duration: preloaderTime/8,
            delay: preloaderTime/4,
            ease: "power2.inOut",
          },
        );
      }
      tl.to(".preloader", {
        opacity: 0,
        duration: preloaderTime/8,
        ease: "power2.inOut",
        onComplete: () => setIsVisible(false),
      });
      // tl.call(() => preloaderRef.current?.remove());
    }
  });
  return (
    isVisible && (
      <div
        ref={preloaderRef}
        suppressHydrationWarning
        className="preloader fixed bottom-auto sm:bottom-0 top-0 sm:top-auto left-1/2 -translate-x-1/2 z-100 bg-background w-full h-screen sm:h-screen flex items-center justify-center"
      >
        <div
          className="preloader-content flex items-center justify-center max-h-96 opacity-0"
          suppressHydrationWarning
        >
          <Image
            src="/af.svg"
            alt="Logo"
            width={100}
            height={100}
            className="logo"
          />
        </div>
      </div>
    )
  );
}
