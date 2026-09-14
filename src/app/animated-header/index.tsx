"use client";

import { motion } from "motion/react";

import { site } from "@/content/site";

const text = site.name;

const CHAR_STAGGER = 0.02;
const CHAR_DURATION = 0.3;
// When the last character's reveal finishes: its delay plus its duration.
const CHARS_DONE = (text.length - 1) * CHAR_STAGGER + CHAR_DURATION;

const variants = {
	initial: { opacity: 0, y: 20 },
	animate: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay,
			duration: 0.2,
			ease: [0.34, 1, 0.64, 1] as [number, number, number, number],
		},
	}),
};

const hoverVariant2 = {
	animate: (index: number = 0) => ({
		y: "0%",
		transition: {
			delay: index * CHAR_STAGGER,
			duration: CHAR_DURATION,
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
		<div className="flex flex-col gap-2 bg-[#0A0A0A] p-4 rounded-2xl shadow-2xl">
			<motion.h1
				initial="initial"
				animate="animate"
				variants={variants}
				className={`helvetica text-xl sm:text-5xl font-[1000] overflow-clip flex relative text-white`}
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
			<motion.h2
				initial="initial"
				animate="animate"
				variants={variants}
				custom={CHARS_DONE}
				className="hidden md:flex helvetica text-md sm:text-md font-semibold overflow-clip relative text-white/50"
			>
				{site.tagline}
			</motion.h2>
		</div>
	);
}
