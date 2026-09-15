"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer } from "./motion";

// Titled block. `data-id` is the hook for future GSAP scroll work.
export function Section({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<motion.section
			id={id}
			data-id={`about-${id}`}
			variants={staggerContainer}
			className="flex w-full flex-col gap-3"
		>
			<motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">
				{title}
			</motion.h2>
			{children}
		</motion.section>
	);
}
