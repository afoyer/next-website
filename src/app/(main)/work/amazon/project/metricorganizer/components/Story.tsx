"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { ArrowDown, ArrowLeft, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { useMobileBreakpoint } from "@/components/nav/hooks";
import { cn } from "@/lib/utils";
import { Sidebar } from "../../../components/Sidebar";
import { CHAPTERS, MO_SECTIONS, metricOrganizer } from "../content";
import { FitBox } from "./primitives";
import { BatchingStage, CardStage, PointStage } from "./stages/config";
import { DashboardStage, ProblemStage } from "./stages/intro";
import { EditorStage, OverridesStage, PlatformsStage, ScaleStage } from "./stages/system";
import { useStageFlip } from "./useStageFlip";

gsap.registerPlugin(ScrollTrigger);

/** One visual per chapter, in CHAPTERS order. */
const STAGES = [
	DashboardStage,
	ProblemStage,
	CardStage,
	PointStage,
	BatchingStage,
	PlatformsStage,
	OverridesStage,
	ScaleStage,
	EditorStage,
];

/** Design size each stage is laid out at; FitBox scales it down to the space available. */
const STAGE_SIZE = { desktop: { width: 680, height: 620 }, mobile: { width: 358, height: 368 } };

const COUNT = CHAPTERS.length;
/** Scroll distance per slide, as a share of the pinned panel's height. Same for every slide. */
const STEP_RATIO = 0.7;
const pad = (n: number) => String(n).padStart(2, "0");

// ─── Story ────────────────────────────────────────────────────────────────────
//
// A scroll-driven carousel. The track is tall; the panel inside it (stage +
// text) stays in view while you scroll through it, and every `step` px of
// scroll advances one slide. Nothing snaps: slides swap in place, and
// useStageFlip morphs the elements stages share (the Command card, its rows,
// the config code) between them.
//
// `step` is measured from the panel (STEP_RATIO × its height), so every slide
// gets exactly the same scroll distance on any screen, regardless of mobile
// browser bars. Track height = panel + COUNT × step, the trigger spans exactly
// COUNT × step, and slide i owns [i, i + 1) × step. The invisible per-chapter
// anchors sit mid-range, so sidebar links (#mo-…) land on their slide.
//
// --mo-offset is where the panel sticks: under the header on desktop, under
// the Work toolbar (113px) on mobile.

export function MetricOrganizerStory() {
	const isMobile = useMobileBreakpoint();
	const reduceMotion = useReducedMotion() ?? false;
	const lenis = useLenis();
	const [step, setStep] = useState(0);
	const [direction, setDirection] = useState(1);
	const trackRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<ScrollTrigger | null>(null);
	const [layout, setLayout] = useState<{ panel: number; step: number } | null>(null);
	const stepSizeRef = useRef(0);
	const capture = useStageFlip(stageRef, step, reduceMotion);

	// The ScrollTrigger is created once; read the latest values through refs.
	const stepRef = useRef(step);
	const captureRef = useRef(capture);
	useLayoutEffect(() => {
		stepRef.current = step;
		captureRef.current = capture;
	});

	// Measure the pinned panel; every slide's scroll distance derives from it.
	useLayoutEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;
		const measure = () => {
			const h = panel.offsetHeight;
			setLayout((prev) =>
				prev?.panel === h ? prev : { panel: h, step: Math.round(h * STEP_RATIO) },
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(panel);
		return () => observer.disconnect();
	}, []);

	// Re-measure the trigger once the track has its new height.
	useLayoutEffect(() => {
		if (!layout) return;
		stepSizeRef.current = layout.step;
		ScrollTrigger.refresh();
	}, [layout]);

	useGSAP(
		() => {
			const panel = panelRef.current;
			if (!panel) return;
			triggerRef.current = ScrollTrigger.create({
				trigger: trackRef.current,
				start: () => `top top+=${Number.parseFloat(getComputedStyle(panel).top) || 0}`,
				// Exactly COUNT equal steps; CSS fallback until the panel is measured.
				end: () => (stepSizeRef.current ? `+=${stepSizeRef.current * COUNT}` : "bottom bottom"),
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const next = Math.min(COUNT - 1, Math.floor(self.progress * COUNT));
					if (next === stepRef.current) return;
					captureRef.current();
					setDirection(next > stepRef.current ? 1 : -1);
					setStep(next);
				},
			});
		},
		{ scope: trackRef },
	);

	/** Scroll to the middle of slide `i`'s range. */
	const goTo = (i: number) => {
		const st = triggerRef.current;
		if (!st || i < 0 || i >= COUNT) return;
		const y = st.start + ((st.end - st.start) * (i + 0.5)) / COUNT;
		if (lenis) lenis.scrollTo(y, { duration: 0.9, immediate: reduceMotion });
		else window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
	};

	const chapter = CHAPTERS[step];
	const Stage = STAGES[step];
	const size = isMobile ? STAGE_SIZE.mobile : STAGE_SIZE.desktop;
	const slide = reduceMotion ? 0 : 32;

	const stepper = (
		<div className="flex items-center gap-1">
			<button
				type="button"
				aria-label={metricOrganizer.previous}
				onClick={() => goTo(step - 1)}
				disabled={step === 0}
				className="flex size-11 items-center justify-center rounded-full text-(--mo-accent) hover:bg-(--mo-accent-soft) disabled:opacity-35 lg:size-9"
			>
				<ChevronUp size={20} />
			</button>
			<button
				type="button"
				aria-label={metricOrganizer.next}
				onClick={() => goTo(step + 1)}
				disabled={step === COUNT - 1}
				className="flex size-11 items-center justify-center rounded-full text-(--mo-accent) hover:bg-(--mo-accent-soft) disabled:opacity-35 lg:size-9"
			>
				<ChevronDown size={20} />
			</button>
		</div>
	);

	return (
		<div className="flex min-h-screen flex-col px-4 pt-28 lg:flex-row lg:px-0 lg:pt-32">
			<Sidebar
				title={metricOrganizer.sidebarTitle}
				toolbarLabel={metricOrganizer.title}
				sections={MO_SECTIONS}
				activeId={chapter.id}
			/>

			<div className="flex min-w-0 flex-1 flex-col py-6 lg:px-12 lg:py-4">
				<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
					{metricOrganizer.breadcrumb.map((crumb) => (
						<span key={crumb.label} className="flex items-center gap-2">
							<Link href={crumb.href} className="text-nav-accent underline underline-offset-2">
								{crumb.label}
							</Link>
							<ChevronRight size={14} className="text-foreground/50" />
						</span>
					))}
					<span className="text-foreground/60">{metricOrganizer.title}</span>
				</nav>
				<h1 className="mt-2 text-[28px] font-bold">{metricOrganizer.title}</h1>

				<div
					ref={trackRef}
					data-id="story-track"
					className="relative mt-5 [--mo-offset:113px] lg:[--mo-offset:8rem]"
					style={{
						height: layout
							? layout.panel + COUNT * layout.step
							: `calc(${COUNT * STEP_RATIO + 1} * (100svh - var(--mo-offset)))`,
					}}
				>
					{CHAPTERS.map((c, i) => (
						<span
							key={c.id}
							id={c.id}
							aria-hidden="true"
							className="pointer-events-none absolute scroll-mt-(--mo-offset)"
							style={{
								top: layout
									? (i + 0.5) * layout.step
									: `calc(${(i + 0.5) * STEP_RATIO} * (100svh - var(--mo-offset)))`,
							}}
						/>
					))}

					<div
						ref={panelRef}
						data-id="story-panel"
						className="sticky top-(--mo-offset) flex h-[calc(100svh-var(--mo-offset))] flex-col pb-4 lg:grid lg:h-[calc(100svh-var(--mo-offset)-1rem)] lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-12 lg:pb-0"
					>
						<div
							data-id="stage"
							className="-mx-4 h-[min(360px,46svh)] shrink-0 border-b border-(--mo-line) bg-background px-4 py-3 lg:mx-0 lg:h-full lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
						>
							<FitBox width={size.width} height={size.height} className="size-full">
								<div ref={stageRef} className="size-full">
									<Stage key={step} compact={isMobile} />
								</div>
							</FitBox>
						</div>

						{/* Desktop: a 1fr / auto / 1fr grid keeps the tracker at the top, the hint at
						    the bottom, and the title + text centred on the stage beside it. */}
						<div
							data-id="story-text"
							className="flex min-h-0 grow flex-col pt-4 lg:grid lg:h-full lg:grid-rows-[1fr_auto_1fr] lg:pt-0"
						>
							<div className="lg:self-start">
								<div className="flex items-center justify-between gap-3">
									<span className="font-mono text-xs tracking-wide text-(--mo-accent-text)">
										{pad(step + 1)} / {pad(COUNT)} · {chapter.label}
									</span>
									{stepper}
								</div>
								<div className="mt-2 flex gap-1">
									{CHAPTERS.map((c, i) => (
										<button
											key={c.id}
											type="button"
											aria-label={c.label}
											aria-current={i === step ? "step" : undefined}
											onClick={() => goTo(i)}
											className="grow py-1.5"
										>
											<span
												className={cn(
													"block h-1 rounded-full transition-colors",
													i <= step ? "bg-(--mo-accent)" : "bg-(--mo-line)",
												)}
											/>
										</button>
									))}
								</div>
							</div>

							<div
								className="relative mt-4 min-h-0 grow overflow-hidden lg:mt-0 lg:py-6"
								aria-live="polite"
							>
								<AnimatePresence mode="wait" initial={false}>
									<motion.div
										key={chapter.id}
										initial={{ opacity: 0, x: direction * slide }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -direction * slide }}
										transition={{ duration: 0.22, ease: "easeOut" }}
									>
										<h2 className="mb-3 text-xl leading-tight font-bold lg:mb-4 lg:text-[26px]">
											{chapter.title}
										</h2>
										{isMobile ? (
											<p className="text-[14.5px] leading-relaxed text-foreground/85">
												{chapter.short}
											</p>
										) : (
											<div className="flex flex-col gap-4 text-base leading-relaxed text-foreground/85">
												{chapter.body.map((paragraph) => (
													<p key={paragraph}>{paragraph}</p>
												))}
											</div>
										)}
										{!isMobile && chapter.details && (
											<dl className="mt-6 flex flex-col gap-3 border-t border-(--mo-line) pt-5 text-sm">
												{chapter.details.map((d) => (
													<div key={d.term}>
														<dt className="font-bold">{d.term}</dt>
														<dd className="text-foreground/70">{d.value}</dd>
													</div>
												))}
											</dl>
										)}
									</motion.div>
								</AnimatePresence>
							</div>

							{!isMobile && step < COUNT - 1 && (
								<span className="flex items-center gap-1.5 self-end text-[13px] text-foreground/55">
									{metricOrganizer.scrollHint}
									<ArrowDown size={14} />
								</span>
							)}
						</div>
					</div>
				</div>

				<footer className="py-12">
					<Link
						href={metricOrganizer.back.href}
						className="inline-flex items-center gap-2 rounded-full border-2 border-nav-accent px-4 py-1.5 text-sm font-bold text-nav-accent hover:bg-nav-accent/10"
					>
						<ArrowLeft size={16} />
						{metricOrganizer.back.label}
					</Link>
				</footer>
			</div>
		</div>
	);
}
