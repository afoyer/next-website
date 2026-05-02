"use client";

import { AnimatePresence, motion, Variants } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/theme";

const iconVariants = {
  initial: { opacity: 0, y: 8, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.8,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
} satisfies Variants;

type DarkModeToggleProps = {
  className?: string;
};

export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const { mode, toggle } = useThemeStore();
  const fill = mode === "dark" ? "white" : "black";

  return (
    <button
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <AnimatePresence mode="wait">
        {mode === "dark" ? (
          <motion.div key="moon" variants={iconVariants} initial="initial" animate="animate" exit="exit">
            <Moon className="h-full aspect-square" stroke={fill} />
          </motion.div>
        ) : (
          <motion.div key="sun" variants={iconVariants} initial="initial" animate="animate" exit="exit">
            <Sun className="h-full aspect-square" stroke={fill} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
