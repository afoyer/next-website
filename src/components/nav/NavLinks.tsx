"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import LinkHover from "../link-hover";
import { navLinks } from "./data";
import { triggerPageTransition } from "@/lib/page-transition";
import styles from "./component.module.scss";

type NavLinksProps = {
  onLinkClick?: () => void;
};

export function NavLinks({ onLinkClick }: NavLinksProps) {
  const router = useRouter();
  // One ref per link, keyed by index
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <>
      {navLinks.map(({ label, href }, i) => {
        const isExternal = href.startsWith("http");

        const handleClick = isExternal
          ? onLinkClick
          : () => {
              onLinkClick?.();
              const el = linkRefs.current[i];
              let origin: { x: number; y: number } | undefined;
              if (el) {
                const r = el.getBoundingClientRect();
                origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
              }
              triggerPageTransition(href, label, (url) => router.push(url), { origin });
            };

        return (
          <div
            key={label}
            ref={(el) => { linkRefs.current[i] = el; }}
          >
            <LinkHover
              className={`p-2 ${styles.navLink}`}
              href={isExternal ? href : "#"}
              onClick={handleClick}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {label}
            </LinkHover>
          </div>
        );
      })}
    </>
  );
}
