"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Skill as SkillData } from "../content";
import { EASE, fadeUp } from "./motion";

const ICON_SIZE = 48;

// Reusable skill tile: a 48px icon slot above a label. Pass `icon` (any React
// node) or `iconSrc` (a /public path); with neither, a placeholder glyph shows.
export function Skill({ skill }: { skill: SkillData }) {
	return (
		<motion.li
			variants={fadeUp}
			whileHover={{ y: -4, scale: 1.06 }}
			whileTap={{ scale: 0.96 }}
			transition={{ duration: 0.2, ease: EASE }}
			data-id={`skill-${skill.id}`}
			className="flex cursor-default flex-col items-center gap-2.5"
		>
			<div
				className="flex shrink-0 items-center justify-center overflow-hidden"
				style={{ width: ICON_SIZE, height: ICON_SIZE }}
			>
				<SkillIcon skill={skill} />
			</div>
			<p className="text-center text-base font-medium">{skill.name}</p>
		</motion.li>
	);
}

function SkillIcon({ skill }: { skill: SkillData }) {
	if (skill.icon) return <>{skill.icon}</>;
	if (skill.iconSrc) {
		return (
			<Image
				src={skill.iconSrc}
				alt=""
				width={ICON_SIZE}
				height={ICON_SIZE}
				className="size-full object-contain"
			/>
		);
	}
	return (
		<div
			aria-hidden
			className="flex size-full items-center justify-center rounded-full border border-dashed border-foreground/40 text-lg font-bold text-foreground/50"
		>
			{skill.name.charAt(0)}
		</div>
	);
}
