"use client";

import { motion } from "motion/react";

const text = "Aymeric Foyer";

const variants = {
	initial: { opacity: 0, y: -20 },
	animate: (index: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: index * 0.07,
			duration: 0.2,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
};

const hoverVariant2 = {
	animate: (index: number = 0) => ({
		y: "0%",
		transition: {
			delay: index * 0.02,
			duration: 0.3,
			ease: [0.303, 0.227, 0.203, 1] as [number, number, number, number],
		},
	}),
	hover: (index: number = 0) => ({
		y: "100%",
		transition: {
			duration: 0.1,
			delay: index * 0.1,
			ease: [0.303, 0.227, 0.203, 1] as [number, number, number, number],
		},
	}),
};
export default function AnimatedHeader() {
	return (
		<motion.h1
			initial="initial"
			animate="animate"
			variants={variants}
			className={`helvetica text-xl sm:text-5xl font-[1000] overflow-clip flex relative`}
		>
			{text.split("").map((char, index) => (
				<motion.div
					// biome-ignore lint/suspicious/noArrayIndexKey: no need
					key={index}
					style={{ display: "inline-block", whiteSpace: "pre" }}
					initial="hover"
					animate="animate"
					variants={hoverVariant2}
					custom={index}
				>
					{char}
				</motion.div>
			))}
		</motion.h1>
	);
}
