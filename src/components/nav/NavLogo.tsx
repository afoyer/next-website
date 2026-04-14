"use client";

import { motion } from "motion/react";
import { useThemeStore } from "@/store/theme";
import styles from "./component.module.scss";

export function NavLogo() {
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <motion.svg
      className={styles.logo}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: [0, 0.2, 1],
        y: 0,
        fill: "var(--nav-icon)",
      }}
      transition={{ duration: 1, delay: 0.5 }}
      viewBox="0 0 271 158"
      xmlns="http://www.w3.org/2000/svg"
      onTap={toggleTheme}
    >
      <path d="M0.180369 156.43C-0.280135 157.093 0.194403 158 1.00173 158H26.8251L38.9084 143.939C39.2599 143.53 39.7151 143.224 40.2262 143.051L105.483 121.074C106.779 120.638 108.121 121.602 108.121 122.969V158H118.09V1H108.644C108.316 1 108.009 1.16049 107.823 1.42959L0.180369 156.43ZM97.2264 98.2205C97.2265 98.6442 96.9596 99.022 96.5602 99.1634L51.9974 114.942C51.0941 115.262 50.3016 114.25 50.828 113.45L95.3778 45.6772C95.923 44.8478 97.2132 45.2336 97.2134 46.2263L97.2264 98.2205Z" />
      <path d="M118.09 1.11L270.09 0L237.613 29H150.42V69H192.057L169.524 99H150.42V158H118.09" />
      <path d="M192.057 69L169.524 99H198.425L220.259 69H192.057Z" />
    </motion.svg>
  );
}
