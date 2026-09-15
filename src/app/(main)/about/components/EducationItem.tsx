"use client";

import { motion } from "motion/react";
import { ThemedImage } from "@/components/themed-image";
import type { Education } from "../content";
import { fadeUp } from "./motion";

export function EducationItem({ item }: { item: Education }) {
	return (
		<motion.li variants={fadeUp} className="flex items-stretch gap-3">
			<div
				data-id={`education-logo-${item.id}`}
				className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden border border-foreground bg-logo-bg px-2"
			>
				<ThemedImage
					lightSrc={item.logo.light}
					darkSrc={item.logo.dark}
					alt={`${item.school} logo`}
					width={100}
					height={100}
					className="max-h-full w-full object-contain"
				/>
			</div>
			<div className="flex flex-col justify-center gap-2 text-base">
				<p className="font-medium">{item.degree}</p>
				{item.detail && <p className="text-xs font-light text-foreground/80">{item.detail}</p>}
				<p className="text-foreground/80">{item.years}</p>
			</div>
		</motion.li>
	);
}
