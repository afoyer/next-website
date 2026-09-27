"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CodeLine, MetricCardData } from "../content";

// ─── FitBox ───────────────────────────────────────────────────────────────────
// Renders children at a fixed design size and scales them down (never up) to
// fit the box, so each stage keeps its exact layout at any viewport size.

export function FitBox({
	width,
	height,
	className,
	children,
}: {
	width: number;
	height: number;
	className?: string;
	children: ReactNode;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			const { width: w, height: h } = entry.contentRect;
			setScale(Math.min(1, w / width, h / height));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [width, height]);

	return (
		<div ref={ref} className={cn("flex items-center justify-center overflow-hidden", className)}>
			<div
				className="shrink-0"
				style={{ width, height, transform: `scale(${scale})`, transformOrigin: "center" }}
			>
				{children}
			</div>
		</div>
	);
}

// ─── Flip ids ─────────────────────────────────────────────────────────────────
// Elements sharing a `data-flip-id` across stages morph into each other when the
// chapter changes (see useStageFlip).

export const COMMAND_CARD_FLIP_ID = "command-card";
export const CONFIG_CODE_FLIP_ID = "config-code";
export const rowFlipId = (label: string) => `row-${label.toLowerCase().replace(/\W+/g, "-")}`;

// ─── Metric card (Cloudscape container with key-value pairs) ──────────────────

export function MetricCard({
	card,
	compact = false,
	highlight = false,
	showSource = false,
	className,
	dataId,
	flipId,
}: {
	card: MetricCardData;
	compact?: boolean;
	highlight?: boolean;
	showSource?: boolean;
	className?: string;
	dataId?: string;
	/** Makes the card, and each of its rows, a shared element across stages. */
	flipId?: string;
}) {
	return (
		<div
			data-id={dataId}
			data-flip-id={flipId}
			className={cn(
				"flex flex-col rounded-2xl border bg-(--mo-surface)",
				compact ? "gap-1.5 rounded-xl px-3 py-2.5" : "gap-2.5 px-5 py-4",
				highlight ? "border-2 border-(--mo-accent) shadow-(--mo-shadow)" : "border-(--mo-line)",
				className,
			)}
		>
			<h3 className={cn("font-bold text-(--mo-accent)", compact ? "text-sm" : "mb-0.5 text-lg")}>
				{card.title}
			</h3>
			{card.rows.map((row) => (
				<MetricRowView
					key={row.label}
					row={row}
					compact={compact}
					showSource={showSource}
					flipId={flipId ? rowFlipId(row.label) : undefined}
				/>
			))}
		</div>
	);
}

export function MetricRowView({
	row,
	compact = false,
	showSource = false,
	flipId,
}: {
	row: MetricCardData["rows"][number];
	compact?: boolean;
	showSource?: boolean;
	flipId?: string;
}) {
	const value = (
		<span className={row.tone === "ok" ? "text-(--mo-ok)" : "text-(--mo-value)"}>
			{row.value}
			{showSource && row.source && (
				<span className="font-mono text-[11px] text-(--mo-muted)"> · {row.source}</span>
			)}
		</span>
	);
	if (compact) {
		return (
			<div data-flip-id={flipId} className="flex justify-between gap-2 text-xs">
				<span className="font-bold text-(--mo-label)">{row.label}</span>
				{value}
			</div>
		);
	}
	return (
		<div data-flip-id={flipId} className="text-sm">
			<div className="font-bold text-(--mo-label)">{row.label}</div>
			<div>{value}</div>
		</div>
	);
}

// ─── Code block ───────────────────────────────────────────────────────────────

const TONE_CLASS: Record<NonNullable<CodeLine["tone"]>, string> = {
	format: "bg-(--mo-code-format)",
	fetch: "bg-(--mo-code-fetch)",
	add: "bg-(--mo-code-add) text-(--mo-code-add-ink)",
	del: "bg-(--mo-code-del) text-(--mo-code-del-ink)",
};

export function CodeBlock({
	lines,
	compact = false,
	className,
	flipId,
}: {
	lines: readonly CodeLine[];
	compact?: boolean;
	className?: string;
	flipId?: string;
}) {
	return (
		<pre
			data-id="code"
			data-flip-id={flipId}
			className={cn(
				"m-0 overflow-hidden rounded-2xl border border-(--mo-code-line) bg-(--mo-code-bg) font-mono text-(--mo-code-ink) shadow-(--mo-shadow)",
				compact ? "rounded-xl py-3 text-xs leading-[1.55]" : "py-5 text-[13px] leading-[1.75]",
			)}
		>
			<code className={cn("block", className)}>
				{lines.map((line, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: static code lines never reorder
						key={i}
						className={cn(
							"flex justify-between gap-4 whitespace-pre",
							compact ? "px-4" : "px-5",
							line.tone && TONE_CLASS[line.tone],
						)}
					>
						<span>
							{line.tone === "add" || line.tone === "del" ? line.text : highlight(line.text)}
						</span>
						{line.note && <span className="text-(--mo-code-note)">{line.note}</span>}
					</span>
				))}
			</code>
		</pre>
	);
}

/** Colours double-quoted strings; everything else stays in the base ink. */
function highlight(text: string): ReactNode[] {
	return text.split(/("[^"]*")/).map((part, i) =>
		part.startsWith('"') ? (
			// biome-ignore lint/suspicious/noArrayIndexKey: split parts are positional
			<span key={i} className="text-(--mo-code-str)">
				{part}
			</span>
		) : (
			part
		),
	);
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={cn("text-xs font-bold uppercase tracking-[0.08em] text-(--mo-muted)", className)}
		>
			{children}
		</span>
	);
}

export function Chip({
	children,
	mono = false,
	className,
}: {
	children: ReactNode;
	mono?: boolean;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"rounded-full border border-(--mo-line) px-2.5 py-1 text-(--mo-value)",
				mono && "font-mono",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function NumberBadge({ n, compact = false }: { n: number; compact?: boolean }) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full bg-(--mo-accent) font-bold text-(--mo-accent-ink)",
				compact ? "size-5 text-[11px]" : "size-[22px] text-xs",
			)}
		>
			{n}
		</span>
	);
}
