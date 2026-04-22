"use client";

import { motion, AnimatePresence } from "motion/react";
import { Menu } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useHeroStore } from "@/store/hero";
import styles from "./component.module.scss";

type NavLogoProps = {
  onClick?: () => void;
  isMobile?: boolean;
};

export function NavLogo({ onClick, isMobile }: NavLogoProps) {
  const toggleTheme = useThemeStore((s) => s.toggle);
  const heroLogoVisible = useHeroStore((s) => s.heroLogoVisible);
  const handleTap = onClick ?? toggleTheme;

  // On mobile: swap logo for burger while hero logo is in view
  const showBurger = !!isMobile && heroLogoVisible;
  // On desktop: hide logo while hero is in view
  const hideLogo = !isMobile && heroLogoVisible;

  return (
    <div className={styles.logo_swap_wrapper}>
      <AnimatePresence mode="wait">
        {showBurger ? (
          <motion.button
            key="burger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.burger_btn}
            onClick={onClick}
          >
            <Menu size={22} color="var(--nav-icon)" />
          </motion.button>
        ) : (
          <motion.svg
            key="logo"
            className={styles.logo}
            animate={{
              fill: "var(--nav-icon)",
              opacity: hideLogo ? 0 : 1,
              pointerEvents: hideLogo ? "none" : "auto",
            }}
            transition={{ duration: 0.3 }}
            viewBox="0 0 271 158"
            xmlns="http://www.w3.org/2000/svg"
            onTap={hideLogo ? undefined : handleTap}
          >
            <path d="M0.180369 156.43C-0.280135 157.093 0.194403 158 1.00173 158H26.8251L38.9084 143.939C39.2599 143.53 39.7151 143.224 40.2262 143.051L105.483 121.074C106.779 120.638 108.121 121.602 108.121 122.969V158H118.09V1H108.644C108.316 1 108.009 1.16049 107.823 1.42959L0.180369 156.43ZM97.2264 98.2205C97.2265 98.6442 96.9596 99.022 96.5602 99.1634L51.9974 114.942C51.0941 115.262 50.3016 114.25 50.828 113.45L95.3778 45.6772C95.923 44.8478 97.2132 45.2336 97.2134 46.2263L97.2264 98.2205Z" />
            <path d="M118.09 1.11L270.09 0L237.613 29H150.42V69H192.057L169.524 99H150.42V158H118.09" />
            <path d="M192.057 69L169.524 99H198.425L220.259 69H192.057Z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}
