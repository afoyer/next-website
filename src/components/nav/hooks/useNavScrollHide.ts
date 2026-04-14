"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const HIDE_THRESHOLD_VH = 50;

export function useNavScrollHide(navRef: React.RefObject<HTMLElement | null>) {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const mm = gsap.matchMedia();

  useGSAP(
    () => {
      const ctx = mm.add(
        {
          mobile: "(max-width: 1023px)",
          desktop: "(min-width: 1024px)",
        },
        (context) => {
          const isMobile = context.conditions?.mobile ?? false;

          const hideNav = () => {
            if (!navRef.current || isHidden.current) return;
            isHidden.current = true;
            gsap.to(navRef.current, {
              y: isMobile ? "-150%" : "150%",
              duration: 0.4,
              ease: "power2.inOut",
            });
          };

          const showNav = () => {
            if (!navRef.current || !isHidden.current) return;
            isHidden.current = false;
            gsap.to(navRef.current, {
              y: 0,
              duration: 0.4,
              ease: "power2.inOut",
            });
          };

          const handleScroll = () => {
            const scrollY =
              window.scrollY ?? document.documentElement.scrollTop;
            const threshold = window.innerHeight * (HIDE_THRESHOLD_VH / 100);
            const scrollingUp = scrollY < lastScrollY.current;

            if (scrollY <= threshold) {
              showNav();
            } else if (scrollingUp) {
              showNav();
            } else {
              hideNav();
            }
            lastScrollY.current = scrollY;
          };

          window.addEventListener("scroll", handleScroll, { passive: true });
          handleScroll();

          if (isHidden.current && navRef.current) {
            gsap.set(navRef.current, { y: isMobile ? "100%" : "-100%" });
          }

          return () => {
            window.removeEventListener("scroll", handleScroll);
          };
        },
      );
      return () => ctx.revert();
    },
    { scope: navRef },
  );
}
