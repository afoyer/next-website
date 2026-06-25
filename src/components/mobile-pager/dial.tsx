"use client";

import { ExternalLink } from "lucide-react";
import { type MotionValue, motion, useTransform } from "motion/react";
import TransitionLink from "@/components/transition-link";
import type { NavItem } from "@/lib/nav-links";
import { ANGLE, ITEM_HEIGHT, itemOpacity, RADIUS } from "./dial-math";
import { useDial } from "./use-dial";

export type DialProps = {
	items: NavItem[];
	index: number;
	active: boolean;
	onSettle: (index: number) => void;
	onSwipeSection: (delta: number) => void;
};

export function Dial({ items, index, active, onSettle, onSwipeSection }: DialProps) {
	const {
		pos,
		stageDeg,
		containerRef,
		didDragRef,
		rollTo,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleKeyDown,
	} = useDial({ count: items.length, index, active, onSettle, onSwipeSection });

	// Capture-phase click gate: a spin/scroll never navigates, and tapping a
	// non-centered item rolls it to center instead of following its link.
	const handleItemClickCapture = (e: React.MouseEvent, i: number) => {
		if (didDragRef.current) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		if (i !== Math.round(pos.get())) {
			e.preventDefault();
			e.stopPropagation();
			rollTo(i);
		}
	};

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: this is a gesture surface; the interactive content is the <a>/<TransitionLink> inside each item */}
			<div
				ref={containerRef}
				className="relative h-full w-full overflow-hidden outline-none"
				style={{ perspective: "700px" }}
				tabIndex={active ? 0 : -1}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onKeyDown={handleKeyDown}
			>
				<motion.div
					className="absolute inset-0"
					style={{ transformStyle: "preserve-3d", rotateX: stageDeg }}
				>
					{items.map((item, i) => (
						<DialItem
							key={item.href}
							item={item}
							i={i}
							pos={pos}
							onClickCapture={(e) => handleItemClickCapture(e, i)}
						/>
					))}
				</motion.div>
			</div>
		</>
	);
}

function DialItem({
	item,
	i,
	pos,
	onClickCapture,
}: {
	item: NavItem;
	i: number;
	pos: MotionValue<number>;
	onClickCapture: (e: React.MouseEvent) => void;
}) {
	const opacity = useTransform(pos, (p) => itemOpacity(p - i));

	return (
		<motion.div
			className="absolute inset-x-0 top-1/2 flex items-center justify-center"
			style={{
				height: ITEM_HEIGHT,
				marginTop: -ITEM_HEIGHT / 2,
				rotateX: -i * ANGLE,
				z: RADIUS,
				opacity,
				backfaceVisibility: "hidden",
			}}
			onClickCapture={onClickCapture}
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
		</motion.div>
	);
}
