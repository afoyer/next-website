"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	AnimatePresence,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CarouselImage } from "../content";
import { EASE } from "./motion";

const AUTOPLAY_MS = 4500;
const BASE_ROTATE = 8; // deg, resting tilt of the card
const TILT_DEG = 14; // max 3D tilt toward the pointer
const PARALLAX_PX = 28; // how far the photo layer drifts against the tilt
const WHEEL_THRESHOLD = 40; // accumulated wheel delta needed to step one slide
const WHEEL_LOCK_MS = 650; // ignore further wheel input while a slide animates
const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

// Desktop-only photo carousel with a pointer-driven parallax: the card tilts
// in 3D toward the cursor, the photo layer drifts the opposite way for depth,
// and a soft gloss follows the pointer. Slides crossfade + slide on change,
// via the arrows, the dots, autoplay, or scrolling over the card.
export function PhotoCarousel({ images }: { images: CarouselImage[] }) {
	const [[index, direction], setState] = useState<[number, 1 | -1]>([0, 1]);
	const [paused, setPaused] = useState(false);
	const reducedMotion = useReducedMotion();
	const cardRef = useRef<HTMLDivElement>(null);

	// normalized pointer offset from the card center, -0.5..0.5
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, SPRING);
	const sy = useSpring(py, SPRING);

	const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT_DEG, TILT_DEG]);
	const rotateX = useTransform(sy, [-0.5, 0.5], [TILT_DEG, -TILT_DEG]);
	const layerX = useTransform(sx, [-0.5, 0.5], [PARALLAX_PX, -PARALLAX_PX]);
	const layerY = useTransform(sy, [-0.5, 0.5], [PARALLAX_PX, -PARALLAX_PX]);
	const glossX = useTransform(sx, [-0.5, 0.5], [0, 100]);
	const glossY = useTransform(sy, [-0.5, 0.5], [0, 100]);
	const gloss = useMotionTemplate`radial-gradient(circle at ${glossX}% ${glossY}%, rgba(255,255,255,0.22), transparent 55%)`;

	const count = images.length;
	const go = (dir: 1 | -1) => setState(([i]) => [(i + dir + count) % count, dir]);

	useEffect(() => {
		if (paused || reducedMotion || count < 2) return;
		const t = setInterval(() => go(1), AUTOPLAY_MS);
		return () => clearInterval(t);
	});

	// Wheel over the card steps slides instead of scrolling the page. Native
	// listener because React registers wheel as passive (no preventDefault).
	// Deltas accumulate so trackpads step once per gesture, not once per tick;
	// the accumulator and lock live in refs so re-renders don't reset them.
	const wheelAccum = useRef(0);
	const wheelLockedUntil = useRef(0);
	useEffect(() => {
		const el = cardRef.current;
		if (!el || count < 2) return;
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const now = performance.now();
			if (now < wheelLockedUntil.current) return;
			const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
			wheelAccum.current += delta;
			if (Math.abs(wheelAccum.current) < WHEEL_THRESHOLD) return;
			const dir: 1 | -1 = wheelAccum.current > 0 ? 1 : -1;
			setState(([i]) => [(i + dir + count) % count, dir]);
			wheelAccum.current = 0;
			wheelLockedUntil.current = now + WHEEL_LOCK_MS;
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [count]);

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (reducedMotion) return;
		const r = e.currentTarget.getBoundingClientRect();
		px.set((e.clientX - r.left) / r.width - 0.5);
		py.set((e.clientY - r.top) / r.height - 0.5);
	};
	const resetPointer = () => {
		px.set(0);
		py.set(0);
	};

	if (count === 0) return null;
	const current = images[index];

	return (
		<div style={{ perspective: 1200 }}>
			<motion.div
				ref={cardRef}
				data-id="about-carousel"
				data-lenis-prevent
				role="region"
				aria-roledescription="carousel"
				aria-label="Photos of me"
				initial={{ opacity: 0, rotate: BASE_ROTATE + 4, scale: 0.96 }}
				animate={{ opacity: 1, rotate: reducedMotion ? 0 : BASE_ROTATE, scale: 1 }}
				whileHover={{ rotate: reducedMotion ? 0 : BASE_ROTATE / 2, scale: 1.02 }}
				transition={{ duration: 0.6, ease: EASE }}
				style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
				onPointerMove={onPointerMove}
				onPointerLeave={resetPointer}
				onHoverStart={() => setPaused(true)}
				onHoverEnd={() => setPaused(false)}
				className="group relative aspect-[700/682] w-full overflow-hidden rounded-[40px] border border-foreground/10 bg-foreground/5 shadow-2xl"
			>
				{/* photo layer: oversized and drifting against the tilt */}
				<motion.div style={{ x: layerX, y: layerY }} className="absolute -inset-8">
					<AnimatePresence initial={false} custom={direction} mode="popLayout">
						<motion.div
							key={current.id}
							custom={direction}
							variants={{
								enter: (d: 1 | -1) => ({ x: `${d * 30}%`, opacity: 0 }),
								center: { x: 0, opacity: 1 },
								exit: (d: 1 | -1) => ({ x: `${d * -30}%`, opacity: 0 }),
							}}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.5, ease: EASE }}
							className="absolute inset-0"
						>
							<Slide image={current} />
						</motion.div>
					</AnimatePresence>
				</motion.div>

				{/* gloss highlight that tracks the pointer */}
				<motion.div
					aria-hidden
					style={{ backgroundImage: gloss }}
					className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				/>

				{count > 1 && (
					<>
						<NavButton side="left" onClick={() => go(-1)} />
						<NavButton side="right" onClick={() => go(1)} />
						<div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
							{images.map((img, i) => (
								<button
									key={img.id}
									type="button"
									aria-label={`Go to photo ${i + 1}`}
									aria-current={i === index}
									onClick={() => setState([i, i > index ? 1 : -1])}
									className={cn(
										"h-1.5 rounded-full bg-foreground/80 transition-all",
										i === index ? "w-6" : "w-1.5 opacity-40 hover:opacity-80",
									)}
								/>
							))}
						</div>
					</>
				)}
			</motion.div>
		</div>
	);
}

function Slide({ image }: { image: CarouselImage }) {
	if (image.src) {
		return (
			<Image src={image.src} alt={image.alt} fill sizes="40vw" className="object-cover" priority />
		);
	}
	return (
		<div
			role="img"
			aria-label={image.alt}
			className="flex size-full items-center justify-center bg-linear-to-br from-zinc-300 to-zinc-400 text-sm text-foreground/50 dark:from-zinc-700 dark:to-zinc-900"
		>
			{image.alt}
		</div>
	);
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
	const Icon = side === "left" ? ChevronLeft : ChevronRight;
	return (
		<button
			type="button"
			aria-label={side === "left" ? "Previous photo" : "Next photo"}
			onClick={onClick}
			className={cn(
				"absolute top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
				side === "left" ? "left-4" : "right-4",
			)}
		>
			<Icon size={20} />
		</button>
	);
}
