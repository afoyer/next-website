import type { Variants } from "motion/react";

export const EASE = [0.4, 0, 0.2, 1] as const;

// Parent: staggers its children. Child: fades and rises into place.
export const staggerContainer: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
