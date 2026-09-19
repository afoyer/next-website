"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { EASE, useReveal } from "@/hooks/useReveal";
import { type Feature, tripjam } from "../../content";
import { CursorTag } from "../hero/CursorTag";
import styles from "../index.module.css";
import { SectionHead } from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

const { features } = tripjam;

/** Which screen edge each tile is dragged in from, in grid order. */
const EDGES = ["left", "bottom", "right", "left", "right"] as const;
type Edge = (typeof EDGES)[number];

/** How much scroll the section stays pinned for while the tiles arrive. */
const PIN_LENGTH = "170%";

// A cursor "holding" a tile by its top-right corner; hidden until the drag.
function Dragger({ index }: { index: number }) {
	const c = tripjam.cursors[index % tripjam.cursors.length];
	return (
		<span
			data-id="dragger"
			aria-hidden="true"
			className="pointer-events-none absolute -right-3 -top-3 z-10 hidden motion-safe:invisible lg:block"
		>
			<CursorTag name={c.name} color={c.color} size={20} />
		</span>
	);
}

// Off-screen start offset for a tile, measured from where it sits in the grid.
function startOffset(el: HTMLElement, edge: Edge): { x: number; y: number } {
	const r = el.getBoundingClientRect();
	switch (edge) {
		case "left":
			return { x: -(r.right + 80), y: 40 };
		case "right":
			return { x: window.innerWidth - r.left + 80, y: 40 };
		default:
			return { x: 0, y: window.innerHeight + r.height };
	}
}

// ── Little UI vignettes, one per tile ────────────────────────────────────────

function Avatars() {
	return (
		<span className="flex">
			<span className="size-7 rounded-full border-2 border-white bg-[#c89b2c]" />
			<span className="-ml-2.5 size-7 rounded-full border-2 border-white bg-[#8fc4a6]" />
			<span className="-ml-2.5 size-7 rounded-full border-2 border-white bg-[#c43a7b]" />
			<span className="-ml-2.5 size-7 rounded-full border-2 border-white bg-[#4c7dd9]" />
		</span>
	);
}

function CollabVignette() {
	return (
		<div
			className={`${styles.dotsSmall} relative h-[110px] overflow-hidden rounded-2xl lg:h-[130px]`}
		>
			<span className="absolute left-4 top-4 lg:left-5 lg:top-5">
				<Avatars />
			</span>
			<span className="absolute left-[55%] top-[46%]">
				<CursorTag name="Emily" color="#c43a7b" size={16} />
			</span>
			<span className="absolute left-[18%] top-[60%]">
				<CursorTag name="Andrew" color="#4c7dd9" size={16} />
			</span>
		</div>
	);
}

function SearchVignette() {
	return (
		<div className="flex h-[110px] flex-col gap-2.5 rounded-2xl bg-(--t-paper) p-3.5 lg:h-[130px] lg:p-4">
			<div className="flex gap-1.5">
				<span className="rounded-full bg-[#1b1b1b] px-2.5 py-1 text-[10px] font-semibold text-white lg:text-[11px]">
					Hotels
				</span>
				<span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#1b1b1b] lg:text-[11px]">
					Attractions
				</span>
				<span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#1b1b1b] lg:text-[11px]">
					Food
				</span>
			</div>
			<div className="flex gap-2.5 rounded-[10px] bg-white p-2">
				<div className="size-9 shrink-0 rounded-md bg-linear-to-br from-[#6e8fb8] to-[#2a3d5c] lg:size-11" />
				<div className="flex flex-col justify-center gap-0.5">
					<span className="text-[11px] font-semibold text-[#1b1b1b] lg:text-xs">
						{tripjam.hotelCard.name}
					</span>
					<span className="text-[9px] text-[#8a8580] lg:text-[10px]">Nishishinjuku · ¥¥¥</span>
				</div>
			</div>
		</div>
	);
}

function VotingVignette() {
	return (
		<div className="flex h-[110px] items-center justify-center gap-3.5 rounded-2xl bg-(--t-paper) lg:h-[130px] lg:gap-4">
			<div className="flex flex-col items-center gap-0.5 rounded-xl bg-white px-3 py-2.5">
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					stroke="#2e9c74"
					strokeWidth="2"
					aria-hidden="true"
				>
					<path d="M8 13V3M3 8l5-5 5 5" />
				</svg>
				<span className="text-lg font-bold text-[#1b1b1b]">+4</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					stroke="#c9c4bc"
					strokeWidth="2"
					aria-hidden="true"
				>
					<path d="M8 3v10M3 8l5 5 5-5" />
				</svg>
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1b1b1b]">
					<span className="text-(--t-accent)">1</span> Kimpton Shinjuku{" "}
					<span className="text-(--t-accent)">+4</span>
				</span>
				<span className="rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#1b1b1b]">
					<span className="text-(--t-accent)">2</span> Hotel Nikko{" "}
					<span className="text-(--t-accent)">+1</span>
				</span>
			</div>
		</div>
	);
}

function ToolsVignette({ handwriting }: { handwriting: string }) {
	const tool = "flex size-7 items-center justify-center rounded-full";
	return (
		<div
			className={`${styles.dotsSmall} relative flex h-[110px] items-end justify-center rounded-2xl pb-3 lg:h-[130px] lg:pb-3.5`}
		>
			<div
				className={`${handwriting} absolute left-4 top-3 -rotate-5 bg-[#f7e38a] px-2 py-1 text-[14px] text-[#3a3120] shadow-[0_3px_8px_rgba(0,0,0,0.1)] lg:left-5 lg:top-4 lg:text-[15px]`}
			>
				ramen night?
			</div>
			<svg
				width="90"
				height="40"
				viewBox="0 0 90 40"
				fill="none"
				aria-hidden="true"
				className="absolute left-[45%] top-5"
			>
				<path
					d="M2 30 C 30 -10, 60 50, 88 8"
					stroke="#4c7dd9"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<path
					d="M80 6 L88 8 L84 15"
					stroke="#4c7dd9"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<div className="flex gap-1.5 rounded-full bg-white p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
				<span className={`${tool} bg-(--t-accent)`}>
					<svg width="12" height="14" viewBox="0 0 16 22" aria-hidden="true">
						<path d="M2 2 L2 18 L6.5 13.5 L9.5 20 L12 19 L9 12.5 L15 12.5 Z" fill="#fff" />
					</svg>
				</span>
				<span className={tool}>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="#1b1b1b"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<rect x="2" y="2" width="12" height="12" rx="2" />
						<path d="M9 14V9h5" />
					</svg>
				</span>
				<span className={tool}>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="#1b1b1b"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<path d="M3 13l1-4 7-7 3 3-7 7-4 1z" />
					</svg>
				</span>
				<span className={tool}>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="#1b1b1b"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<path d="M9 3l4 4-6 6H4l-1-1 6-9zM2 14h12" />
					</svg>
				</span>
				<span className={tool}>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="#1b1b1b"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<circle cx="8" cy="8" r="6" />
						<path d="M5.5 9.5c1.5 1.5 3.5 1.5 5 0M6 6h.01M10 6h.01" />
					</svg>
				</span>
			</div>
		</div>
	);
}

function Vignette({ id, handwriting }: { id: Feature["id"]; handwriting: string }) {
	switch (id) {
		case "collab":
			return <CollabVignette />;
		case "search":
			return <SearchVignette />;
		case "voting":
			return <VotingVignette />;
		default:
			return <ToolsVignette handwriting={handwriting} />;
	}
}

// ── Section ──────────────────────────────────────────────────────────────────

// 03 — bento of feature tiles; the AI itinerary gets the wide dark one.
export function FeaturesSection({ handwriting }: { handwriting: string }) {
	const ref = useRef<HTMLElement>(null);
	const { itinerary } = features;

	useReveal(ref, ({ scope }) => {
		const mm = gsap.matchMedia();
		const tiles = gsap.utils.toArray<HTMLElement>('[data-id="tile"]', scope);

		// Desktop: pin the section and let cursors drag each tile in from the edges.
		mm.add("(min-width: 1024px)", () => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: scope,
					start: "top top",
					end: `+=${PIN_LENGTH}`,
					pin: true,
					scrub: 0.6,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				},
			});

			tiles.forEach((tile, i) => {
				const edge = EDGES[i % EDGES.length];
				const cursor = tile.querySelector('[data-id="dragger"]');
				const at = i * 0.55;
				const tilt = edge === "left" ? -7 : edge === "right" ? 7 : -4;

				// Held: tilted, lifted, with a deeper shadow…
				tl.fromTo(
					tile,
					{
						x: () => startOffset(tile, edge).x,
						y: () => startOffset(tile, edge).y,
						rotate: tilt,
						scale: 1.04,
						boxShadow: "0 40px 80px rgba(60,50,40,0.28)",
					},
					// …dragged to its slot and dropped.
					{
						x: 0,
						y: 0,
						rotate: 0,
						scale: 1,
						boxShadow: "0 0px 0px rgba(60,50,40,0)",
						duration: 1,
						ease: "power2.inOut",
					},
					at,
				);
				if (cursor) {
					tl.set(cursor, { autoAlpha: 1 }, at)
						// The hand lets go and drifts off once the tile has landed.
						.to(cursor, { x: 36, y: -26, autoAlpha: 0, duration: 0.3, ease: EASE }, at + 1.05);
				}
			});
		});

		// Phones: a plain stagger as the grid scrolls in.
		mm.add("(max-width: 1023px)", () => {
			gsap.from(tiles, {
				y: 36,
				autoAlpha: 0,
				duration: 0.8,
				ease: EASE,
				stagger: 0.08,
				scrollTrigger: { trigger: '[data-id="tile-grid"]', start: "top 80%", once: true },
			});
		});
	});

	return (
		<section
			ref={ref}
			className="flex flex-col items-center gap-9 overflow-clip px-7 pb-18 pt-22 lg:gap-10 lg:px-[170px] lg:pb-20 lg:pt-20"
		>
			<SectionHead heading={features.heading} body={features.body} maxWidth="max-w-[600px]" />

			<div
				data-id="tile-grid"
				className="grid w-full max-w-[1100px] grid-cols-1 gap-3.5 lg:grid-cols-3 lg:auto-rows-[minmax(280px,auto)] lg:gap-5"
			>
				{features.items.map((f, i) => (
					<div
						key={f.id}
						data-id="tile"
						className="relative flex flex-col justify-between gap-4 rounded-3xl bg-(--t-card) p-5.5 lg:rounded-[28px] lg:p-8"
					>
						<Dragger index={i} />
						<Vignette id={f.id} handwriting={handwriting} />
						<div className="flex flex-col gap-1.5">
							<span className="text-lg font-semibold tracking-[-0.01em] lg:text-xl">{f.title}</span>
							<span className="text-sm leading-normal text-(--t-muted)">{f.body}</span>
						</div>
					</div>
				))}

				{/* AI itinerary */}
				<div
					data-id="tile"
					className="relative flex flex-col gap-4 rounded-3xl bg-[#1b1b1b] p-6 text-white lg:col-span-2 lg:flex-row lg:gap-8 lg:rounded-[28px] lg:p-8"
				>
					<Dragger index={features.items.length} />
					<div className="flex flex-1 flex-col justify-between gap-4">
						<div className="flex flex-col gap-2.5">
							<span className="text-[22px] font-semibold leading-tight tracking-[-0.02em] lg:text-[26px]">
								{itinerary.title}
							</span>
							<span className="max-w-[420px] text-sm leading-relaxed text-[#b8b3ac] lg:text-[15px]">
								{itinerary.body}
							</span>
						</div>
						<div className="flex gap-2.5">
							<span className="rounded-full bg-(--t-accent) px-4 py-2.5 text-[13px] font-semibold text-(--t-accent-ink)">
								{itinerary.primary}
							</span>
							<span className="rounded-full bg-[#2a2a2a] px-4 py-2.5 text-[13px] font-semibold">
								{itinerary.secondary}
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-2 rounded-2xl bg-white p-4 text-[#1b1b1b] lg:w-[300px] lg:p-5">
						{itinerary.days.map((d) => (
							<div key={d.label} className="flex flex-col gap-2 not-first:mt-1.5">
								<span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a8580]">
									{d.label}
								</span>
								{d.stops.map((s) => (
									<span key={s.time} className="flex gap-2.5 text-xs">
										<span className={`${styles.mono} text-[#8a8580]`}>{s.time}</span>
										<span className="font-semibold">{s.name}</span>
									</span>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
