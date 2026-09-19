"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "@/content/nav";
import { Dial } from "./dial";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 32 };

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

type Position = { section: number; items: number[] };

type Props = { onPreview: (src: string | null) => void };

export function MobilePager({ onPreview }: Props) {
	const [pos, setPos] = useState<Position>(() => ({
		section: 0,
		items: NAV_SECTIONS.map(() => 0),
	}));

	const { section, items } = pos;
	const itemIndex = items[section];

	// the active item's raw photo (frame) drives the renderer; updates on settle
	useEffect(() => {
		onPreview(NAV_SECTIONS[section].items[items[section]].frame ?? null);
	}, [section, items, onPreview]);

	const goToSection = (target: number) =>
		setPos((p) => ({ ...p, section: clamp(target, 0, NAV_SECTIONS.length - 1) }));

	const moveSection = (delta: number) =>
		setPos((p) => ({ ...p, section: clamp(p.section + delta, 0, NAV_SECTIONS.length - 1) }));

	const setItemIndex = (sectionIndex: number, target: number) =>
		setPos((p) => ({
			...p,
			items: p.items.map((v, i) => (i === sectionIndex ? target : v)),
		}));

	return (
		<div className="sm:hidden fixed inset-0 z-10 flex flex-col touch-none">
			{/* tab bar */}
			<div data-id="mobile-tabs" className="flex justify-center gap-8 pt-32">
				{NAV_SECTIONS.map((s, i) => (
					<button
						key={s.id}
						type="button"
						onClick={() => goToSection(i)}
						aria-current={i === section ? "true" : undefined}
						className="relative pb-1 text-sm lowercase tracking-wide"
					>
						<span className={i === section ? "" : "opacity-50"}>{s.label}</span>
						{i === section && (
							<motion.div
								layoutId="mobile-tab-underline"
								className="absolute inset-x-0 bottom-0 h-px bg-current"
								transition={SPRING}
							/>
						)}
					</button>
				))}
			</div>

			{/* slides */}
			<div className="relative flex-1 overflow-hidden">
				<motion.div
					className="flex h-full"
					animate={{ x: `-${section * 100}%` }}
					transition={SPRING}
				>
					{NAV_SECTIONS.map((s, si) => (
						<div key={s.id} className="h-full w-full shrink-0 overflow-hidden">
							<Dial
								items={s.items}
								index={items[si]}
								active={si === section}
								onSettle={(i) => setItemIndex(si, i)}
								onSwipeSection={moveSection}
							/>
						</div>
					))}
				</motion.div>

				{/* item position dots for the active section */}
				<div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-2">
					{NAV_SECTIONS[section].items.map((item, i) => (
						<button
							key={item.href}
							type="button"
							onClick={() => setItemIndex(section, i)}
							aria-label={`go to ${item.label}`}
							aria-current={i === itemIndex ? "true" : undefined}
							className={`h-1.5 w-1.5 rounded-full bg-current transition-opacity ${
								i === itemIndex ? "opacity-90" : "opacity-30"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
