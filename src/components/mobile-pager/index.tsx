"use client";

import { ExternalLink } from "lucide-react";
import { motion, type PanInfo } from "motion/react";
import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/transition-link";
import { NAV_SECTIONS } from "@/lib/nav-links";

const SWIPE_OFFSET = 60; // px before a pan commits to a page change
const SWIPE_VELOCITY = 400; // px/s — fast flicks commit below the offset
const SPRING = { type: "spring" as const, stiffness: 300, damping: 32 };

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

type Position = { section: number; items: number[] };

function withItem(p: Position, update: (current: number) => number): Position {
	return {
		...p,
		items: p.items.map((v, i) =>
			i === p.section ? clamp(update(v), 0, NAV_SECTIONS[p.section].items.length - 1) : v,
		),
	};
}

type Props = { onPreview: (src: string | null) => void };

export function MobilePager({ onPreview }: Props) {
	const [pos, setPos] = useState<Position>(() => ({
		section: 0,
		items: NAV_SECTIONS.map(() => 0),
	}));
	// true while a pan gesture is in flight so the click it lands on can be suppressed
	const pannedRef = useRef(false);

	const { section, items } = pos;
	const itemIndex = items[section];

	// the active slide's preview drives the background (including the first slide on mount)
	useEffect(() => {
		onPreview(NAV_SECTIONS[section].items[items[section]].preview ?? null);
	}, [section, items, onPreview]);

	const goToSection = (target: number) =>
		setPos((p) => ({ ...p, section: clamp(target, 0, NAV_SECTIONS.length - 1) }));

	const moveSection = (delta: number) =>
		setPos((p) => ({ ...p, section: clamp(p.section + delta, 0, NAV_SECTIONS.length - 1) }));

	const goToItem = (target: number) => setPos((p) => withItem(p, () => target));

	const moveItem = (delta: number) => setPos((p) => withItem(p, (v) => v + delta));

	const handlePanStart = () => {
		pannedRef.current = true;
	};

	const handlePanEnd = (_: unknown, info: PanInfo) => {
		const { offset, velocity } = info;
		if (Math.abs(offset.x) > Math.abs(offset.y)) {
			if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) moveSection(1);
			else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) moveSection(-1);
		} else {
			if (offset.y < -SWIPE_OFFSET || velocity.y < -SWIPE_VELOCITY) moveItem(1);
			else if (offset.y > SWIPE_OFFSET || velocity.y > SWIPE_VELOCITY) moveItem(-1);
		}
		// the gesture's trailing click fires synchronously after touchend; reset afterwards
		setTimeout(() => {
			pannedRef.current = false;
		}, 0);
	};

	const suppressClickAfterPan = (e: React.MouseEvent) => {
		if (pannedRef.current) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	return (
		<div className="sm:hidden fixed inset-0 z-10 flex flex-col touch-none">
			{/* tab bar */}
			<div className="flex justify-center gap-8 pt-32">
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
			<motion.div
				className="relative flex-1 overflow-hidden"
				onPanStart={handlePanStart}
				onPanEnd={handlePanEnd}
				onClickCapture={suppressClickAfterPan}
			>
				<motion.div
					className="flex h-full"
					animate={{ x: `-${section * 100}%` }}
					transition={SPRING}
				>
					{NAV_SECTIONS.map((s, si) => (
						<div key={s.id} className="h-full w-full shrink-0 overflow-hidden">
							<motion.div
								className="h-full"
								animate={{ y: `-${items[si] * 100}%` }}
								transition={SPRING}
							>
								{s.items.map((item) => (
									<div
										key={item.href}
										className="flex h-full w-full flex-col items-center justify-center gap-3"
									>
										{item.external ? (
											<a
												href={item.href}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-4xl lowercase font-bold"
											>
												{item.label}
												<ExternalLink size={20} />
											</a>
										) : (
											<TransitionLink href={item.href} className="text-4xl lowercase font-bold">
												{item.label}
											</TransitionLink>
										)}
									</div>
								))}
							</motion.div>
						</div>
					))}
				</motion.div>

				{/* item position dots for the active section */}
				<div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-2">
					{NAV_SECTIONS[section].items.map((item, i) => (
						<button
							key={item.href}
							type="button"
							onClick={() => goToItem(i)}
							aria-label={`go to ${item.label}`}
							aria-current={i === itemIndex ? "true" : undefined}
							className={`h-1.5 w-1.5 rounded-full bg-current transition-opacity ${
								i === itemIndex ? "opacity-90" : "opacity-30"
							}`}
						/>
					))}
				</div>
			</motion.div>
		</div>
	);
}
