"use client";

import { motion } from "motion/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });
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
const hoverVariants = {
	animate: (index: number = 0) => ({
		y: "100%",
		transition: {
			delay: index * 0.01,
			duration: 0.1,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
	hover: (index: number = 0) => ({
		y: "0%",
		transition: {
			duration: 0.1,
			delay: index * 0.02,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
};
const hoverVariant2 = {
	animate: (index: number = 0) => ({
		y: "0%",
		transition: {
			delay: index * 0.01,
			duration: 0.1,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
	hover: (index: number = 0) => ({
		y: "-100%",
		transition: {
			duration: 0.1,
			delay: index * 0.02,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
};
export default function AnimatedHeader() {
	return (
		<motion.h1
			initial="initial"
			animate="animate"
			whileHover="hover"
			variants={variants}
			className={`helvetica text-lg sm:text-2xl font-[1000] overflow-hidden flex relative`}
		>
			{text.split("").map((char, index) => (
				<motion.span
					// biome-ignore lint/suspicious/noArrayIndexKey: no need
					key={index}
					style={{ display: "inline-block", whiteSpace: "pre" }}
					variants={hoverVariant2}
					custom={index}
				>
					{char}
				</motion.span>
			))}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
				{text.split("").map((char, index) => (
					<motion.span
						// biome-ignore lint/suspicious/noArrayIndexKey: no need
						key={index}
						style={{ display: "inline-block", whiteSpace: "pre" }}
						variants={hoverVariants}
						custom={index}
					>
						{char}
					</motion.span>
				))}
			</div>
		</motion.h1>
	);
}
