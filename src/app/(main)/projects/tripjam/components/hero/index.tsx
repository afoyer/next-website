"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { type Cursor, tripjam } from "../../content";
import styles from "../index.module.css";
import { CursorTag } from "./CursorTag";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** Where along its trail a cursor sits once the intro has played (0–1). */
const REST = 0.35;
/** How much scroll the hero stays pinned for while the cursors travel. */
const PIN_LENGTH = "120%";

// Hero: the TripJam wordmark on a board-style dot grid, with named cursors
// that fly in on load and then ride their dashed trails as you scroll.
export function TripJamHero({ handwriting }: { handwriting: string }) {
	const ref = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const hero = ref.current;
			if (!hero) return;
			const mm = gsap.matchMedia();
			mm.add(
				{
					desktop: "(min-width: 768px)",
					mobile: "(max-width: 767px)",
					ok: "(prefers-reduced-motion: no-preference)",
				},
				(ctx) => {
					if (!ctx.conditions?.ok) return;

					// Cursors that are actually rendered at this breakpoint.
					const cursors = gsap.utils
						.toArray<HTMLElement>('[data-id="cursor"]', hero)
						.filter((el) => el.offsetParent !== null);

					// One scrubbed timeline drives the pinned hero: the section holds
					// for PIN_LENGTH of scroll while the cursors ride their trails, the
					// post-it and card drift, and the lockup fades out near the end.
					const scrub = gsap.timeline({
						scrollTrigger: {
							trigger: hero,
							start: "top top",
							end: `+=${PIN_LENGTH}`,
							pin: true,
							scrub: 0.8,
							anticipatePin: 1,
						},
					});

					cursors.forEach((el, i) => {
						const path = hero.querySelector<SVGPathElement>(`#${el.dataset.trail}`);
						if (!path) return;
						const motion = { path, align: path, alignOrigin: [0.1, 0.05] as [number, number] };

						// Fly in from the edge on load…
						gsap.fromTo(
							el,
							{ autoAlpha: 0 },
							{
								autoAlpha: 1,
								motionPath: { ...motion, start: 0, end: REST },
								duration: 1.6,
								delay: 0.15 + i * 0.12,
								ease: "power3.out",
							},
						);
						// …then ride the rest of the trail while the hero is pinned.
						scrub.to(
							el,
							{ motionPath: { ...motion, start: REST, end: 1 }, ease: "none", duration: 1 },
							0,
						);
						// Idle bob so they never sit perfectly still.
						const inner = el.firstElementChild;
						if (inner) {
							gsap.to(inner, {
								y: 6,
								duration: 1.3 + i * 0.17,
								repeat: -1,
								yoyo: true,
								ease: "sine.inOut",
							});
						}
					});

					scrub
						.to('[data-id="hero-postit"]', { y: -120, rotate: -9, ease: "none", duration: 1 }, 0)
						.to('[data-id="hero-card"]', { y: -200, rotate: 8, ease: "none", duration: 1 }, 0)
						.to(
							'[data-id="hero-lockup"]',
							{ y: -60, autoAlpha: 0, ease: "none", duration: 0.35 },
							0.65,
						)
						.to('[data-id="hero-hint"]', { autoAlpha: 0, ease: "none", duration: 0.2 }, 0);

					gsap.from('[data-id="hero-lockup"] > *', {
						y: 24,
						autoAlpha: 0,
						duration: 0.9,
						stagger: 0.1,
						ease: "power3.out",
					});
				},
			);
		},
		{ scope: ref },
	);

	return (
		<section
			ref={ref}
			className={`${styles.dots} relative flex h-svh min-h-[640px] items-center justify-center overflow-hidden`}
		>
			{/* Dashed trails the cursors ride. */}
			<svg
				viewBox="0 0 1440 820"
				preserveAspectRatio="none"
				aria-hidden="true"
				className="absolute inset-0 size-full"
			>
				{tripjam.cursors.map((c, i) => (
					<path
						key={c.name}
						id={`tj-trail-${i}`}
						d={c.trail}
						fill="none"
						stroke={c.color}
						strokeWidth="1.5"
						strokeDasharray="4 8"
						opacity="0.5"
						className={c.mobile ? "" : "hidden md:block"}
						vectorEffect="non-scaling-stroke"
					/>
				))}
			</svg>

			{tripjam.cursors.map((c, i) => (
				<CursorAt key={c.name} cursor={c} index={i} />
			))}

			{/* A post-it and a hotel card, like the ones on the board. */}
			<div
				data-id="hero-postit"
				className={`${handwriting} absolute left-4 top-[18%] w-[118px] -rotate-4 bg-[#f7e38a] px-3 pb-3 pt-2.5 text-[17px] leading-[1.15] text-[#3a3120] shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:left-[10%] md:top-[30%] md:w-[170px] md:px-4 md:pb-4.5 md:pt-3.5 md:text-[22px]`}
			>
				{tripjam.postIt}
			</div>
			<div
				data-id="hero-card"
				className="absolute bottom-[14%] right-[10%] hidden w-[150px] rotate-3 flex-col gap-1.5 rounded-md bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:flex"
			>
				<div className="h-[86px] rounded bg-linear-to-br from-[#6e8fb8] to-[#2a3d5c]" />
				<span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8a8580]">
					{tripjam.hotelCard.kind}
				</span>
				<span className="-mt-1 text-[11px] font-bold text-[#1b1b1b]">{tripjam.hotelCard.name}</span>
				<div className="flex gap-1">
					<span className="size-4 rounded-full bg-[#c89b2c]" />
					<span className="size-4 rounded-full bg-[#8fc4a6]" />
					<span className="size-4 rounded-full bg-[#4c7dd9]" />
				</div>
			</div>

			{/* Centre lockup. */}
			<div
				data-id="hero-lockup"
				className="relative flex flex-col items-center gap-4 px-4 text-center md:gap-5"
			>
				<div className="flex items-center gap-2.5 rounded-full border border-(--t-line) bg-(--t-card) py-1.5 pl-2 pr-3.5 text-[11px] font-semibold text-(--t-muted) md:text-xs">
					<span className="flex">
						<span className="size-5 rounded-full border-2 border-white bg-[#c89b2c]" />
						<span className="-ml-2 size-5 rounded-full border-2 border-white bg-[#8fc4a6]" />
						<span className="-ml-2 size-5 rounded-full border-2 border-white bg-[#c43a7b]" />
					</span>
					<span>{tripjam.room.label}</span>
				</div>
				<h1
					className={`${handwriting} text-[76px] font-bold leading-[0.95] tracking-[-0.03em] md:text-[128px]`}
				>
					{tripjam.name}
				</h1>
				<p className="max-w-[560px] text-base font-medium leading-snug text-(--t-muted) md:text-[22px]">
					{tripjam.tagline}
				</p>
				<span className="rounded-full bg-[#1b1b1b] px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] text-white md:text-xs">
					{tripjam.event.toUpperCase()}
				</span>
			</div>

			<div
				data-id="hero-hint"
				className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-(--t-muted)"
			>
				<span>SCROLL</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					aria-hidden="true"
				>
					<path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
				</svg>
			</div>
		</section>
	);
}

// A cursor parked at the top-left of the hero; GSAP moves it onto its trail.
function CursorAt({ cursor, index }: { cursor: Cursor; index: number }) {
	return (
		<div
			data-id="cursor"
			data-trail={`tj-trail-${index}`}
			className={`motion-safe:invisible absolute left-0 top-0 ${cursor.mobile ? "flex" : "hidden md:flex"}`}
		>
			<CursorTag name={cursor.name} color={cursor.color} />
		</div>
	);
}
