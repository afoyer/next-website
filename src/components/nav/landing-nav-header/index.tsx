"use client";

import { motion } from "motion/react";
import { EASE_SPRING } from "..";
import { DarkModeToggle } from "../DarkModeToggle";

const variants = {
	initial: { opacity: 0, x: -8 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -8 },
};
const charVariants = {
	initial: { opacity: 1, x: "-100%" },
	animate: (index: number) => {
		return { opacity: 1, x: "0%", transition: { duration: 0.2, delay: index * 0.03 } };
	},
	exit: { opacity: 0, x: 6 },
};
const initialText = "/landing-page";

export default function LandingNavHeader() {
	return (
		<div className="flex items-center justify-between">
			<motion.div
				key="landing"
				className="text-black/50 dark:text-white/35 text-xs font-medium"
				initial={"initial"}
				animate={"animate"}
				exit={"exit"}
				variants={variants}
				transition={{ duration: 0, ease: EASE_SPRING }}
			>
				{initialText.split("").map((char, index) => (
					<motion.div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="inline-block overflow-hidden"
					>
						<motion.p variants={charVariants} custom={index}>
							{char}
						</motion.p>
					</motion.div>
				))}
			</motion.div>
			<DarkModeToggle className="text-black/50 dark:text-white/35" />
		</div>
	);
}
