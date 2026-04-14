"use client";

import LinkHover from "../link-hover";
import { navLinks } from "./data";
import styles from "./component.module.scss";

type NavLinksProps = {
  onLinkClick?: () => void;
};

export function NavLinks({ onLinkClick }: NavLinksProps) {
  return (
    <>
      {navLinks.map(({ label, href }) => (
        <LinkHover
          key={label}
          className={`p-2 ${styles.navLink}`}
          href={href}
          onClick={onLinkClick}
        >
          {label}
        </LinkHover>
      ))}
    </>
  );
}
