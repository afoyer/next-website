import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { stage } from "../../content";
import {
	COMMAND_CARD_FLIP_ID,
	CONFIG_CODE_FLIP_ID,
	CodeBlock,
	MetricRowView,
	NumberBadge,
	rowFlipId,
} from "../primitives";

// 03 · One CARD widget next to its config.
export function CardStage({ compact }: { compact: boolean }) {
	const c = stage.card;
	const card = (
		<div
			data-id="card-command"
			data-flip-id={COMMAND_CARD_FLIP_ID}
			className={cn(
				"flex flex-col rounded-2xl border-2 border-(--mo-accent) bg-(--mo-surface) shadow-(--mo-shadow)",
				compact ? "gap-1.5 rounded-xl px-3 py-2.5" : "w-[290px] shrink-0 gap-2.5 px-5 py-4",
			)}
		>
			<div className="flex items-center justify-between">
				<h3 className={cn("font-bold text-(--mo-accent)", compact ? "text-[15px]" : "text-lg")}>
					{c.card.title}
				</h3>
				<NumberBadge n={1} compact={compact} />
			</div>
			<div className="flex items-start gap-2.5">
				<div
					className={cn(
						"flex grow flex-col rounded-lg border border-dashed border-(--mo-line-strong)",
						compact ? "gap-1 p-2" : "gap-2.5 p-2.5",
					)}
				>
					{c.card.rows.map((row) => (
						<MetricRowView
							key={row.label}
							row={row}
							compact={compact}
							flipId={rowFlipId(row.label)}
						/>
					))}
				</div>
				<div className="flex flex-col gap-2 pt-1">
					<NumberBadge n={2} compact={compact} />
					<NumberBadge n={3} compact={compact} />
				</div>
			</div>
		</div>
	);

	if (compact) {
		return (
			<div className="flex flex-col gap-3">
				{card}
				<CodeBlock compact lines={c.code} flipId={CONFIG_CODE_FLIP_ID} />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3.5">
				<div className="grid w-[120px] grid-cols-2 gap-1 rounded-lg border border-(--mo-line) p-1.5">
					{[0, 1, 2, 3].map((i) => (
						<div
							key={i}
							className={cn("h-7 rounded", i === 1 ? "bg-(--mo-accent)" : "bg-(--mo-surface-2)")}
						/>
					))}
				</div>
				<span className="text-[13px] text-(--mo-muted)">{c.lifted}</span>
			</div>
			<div className="flex items-start gap-7">
				{card}
				<CodeBlock lines={c.code} className="text-sm" flipId={CONFIG_CODE_FLIP_ID} />
			</div>
			<div className="grid grid-cols-3 gap-3">
				{c.legend.map((item) => (
					<div
						key={item.key}
						className="rounded-xl border border-(--mo-line) px-3.5 py-3 text-[13px]"
					>
						<div className="font-bold text-(--mo-label)">{item.key}</div>
						<div className="text-(--mo-muted)">{item.value}</div>
					</div>
				))}
			</div>
		</div>
	);
}

// 04 · One point: format vs fetch.
export function PointStage({ compact }: { compact: boolean }) {
	const p = stage.point;
	const [first, ...rest] = p.card.rows;

	const tags = (
		<div
			className={cn(
				"flex flex-wrap items-center text-(--mo-value)",
				compact ? "gap-2 text-xs" : "gap-2.5 text-sm",
			)}
		>
			<span className="rounded-md bg-(--mo-accent-soft) px-2 py-1 text-[11px] font-bold tracking-wider text-(--mo-accent-text)">
				{p.format.tag}
			</span>
			<span className={compact ? "mr-2" : "mr-6"}>{p.format.label}</span>
			<span className="rounded-md bg-(--mo-fetch-soft) px-2 py-1 text-[11px] font-bold tracking-wider text-(--mo-fetch-text)">
				{p.fetch.tag}
			</span>
			<span>{p.fetch.label}</span>
		</div>
	);

	if (compact) {
		return (
			<div className="flex flex-col gap-3">
				<div
					data-id="point-row"
					data-flip-id={rowFlipId(first.label)}
					className="flex justify-between rounded-lg border-2 border-(--mo-accent) bg-(--mo-surface) px-3 py-2 text-[13px] shadow-(--mo-shadow)"
				>
					<span className="font-bold text-(--mo-label)">{first.label}</span>
					<span className="font-bold text-(--mo-label)">{first.value}</span>
				</div>
				<CodeBlock compact lines={p.code} flipId={CONFIG_CODE_FLIP_ID} />
				{tags}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-start gap-7">
				<div className="relative h-[250px] w-[260px] shrink-0">
					<div
						data-flip-id={COMMAND_CARD_FLIP_ID}
						className="absolute inset-0 flex flex-col gap-2.5 rounded-2xl border border-(--mo-line) px-5 py-4 opacity-35"
					>
						<h3 className="mb-0.5 text-lg font-bold text-(--mo-accent)">{p.card.title}</h3>
						<div className="h-10" />
						{rest.map((row) => (
							<MetricRowView key={row.label} row={row} flipId={rowFlipId(row.label)} />
						))}
					</div>
					<div
						data-id="point-row"
						data-flip-id={rowFlipId(first.label)}
						className="absolute top-12 left-9 w-60 rounded-xl border-2 border-(--mo-accent) bg-(--mo-surface) px-3.5 py-2.5 shadow-(--mo-shadow)"
					>
						<MetricRowView row={first} />
					</div>
				</div>
				<div className="grow">
					<CodeBlock lines={p.code} flipId={CONFIG_CODE_FLIP_ID} />
				</div>
			</div>
			{tags}
			<div className="flex items-center gap-3 rounded-2xl border border-(--mo-line) px-4.5 py-4">
				{p.transform.map((step, i) => (
					<div key={step.label} className="flex items-center gap-3">
						{i > 0 && <ArrowRight size={20} className="text-(--mo-line-strong)" />}
						<div className="flex flex-col gap-0.5">
							<span className="text-xs text-(--mo-muted)">{step.label}</span>
							<span
								className={cn(
									i === 0 && "font-mono text-lg text-(--mo-label)",
									i === 1 && "font-mono text-sm text-(--mo-accent-text)",
									i === 2 && "text-lg font-bold text-(--mo-label)",
								)}
							>
								{step.value}
							</span>
						</div>
					</div>
				))}
				<div className="ml-auto flex flex-col items-end gap-1.5">
					<span className="text-xs text-(--mo-muted)">{p.alsoLabel}</span>
					<div className="flex max-w-[230px] flex-wrap justify-end gap-1.5">
						{p.also.map((kind) => (
							<span
								key={kind}
								className="rounded-md border border-(--mo-line) px-2 py-1 font-mono text-[11px] text-(--mo-value)"
							>
								{kind}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// 05 · Point queries collapse into one GraphQL request.
export function BatchingStage({ compact }: { compact: boolean }) {
	const b = stage.batching;
	const rows = stage.card.card.rows;
	return (
		<div className={cn("flex flex-col", compact ? "pt-2" : "pt-6")}>
			<span className={cn("text-(--mo-muted)", compact ? "mb-2.5 text-xs" : "mb-3.5 text-[13px]")}>
				{b.caption}
			</span>
			<div className={cn("grid grid-cols-3", compact ? "gap-2" : "gap-4")}>
				{rows.map((row) => (
					<div key={row.label} className="flex flex-col items-center">
						<div
							data-flip-id={rowFlipId(row.label)}
							className={cn(
								"w-full rounded-xl border border-(--mo-line) bg-(--mo-surface) font-bold text-(--mo-label)",
								compact ? "p-2 text-xs" : "px-3.5 py-2.5 text-sm",
							)}
						>
							{row.label}
							{!compact && <div className="font-normal text-(--mo-line-strong)">—</div>}
						</div>
						<div className={cn("w-0.5 bg-(--mo-query)", compact ? "h-3" : "h-[18px]")} />
						<span
							data-id="query-pill"
							className={cn(
								"rounded-xl bg-(--mo-query) font-mono text-(--mo-query-ink)",
								compact ? "px-3 py-1 text-[11px]" : "px-[18px] py-2 text-[13px]",
							)}
						>
							{b.query}
						</span>
						<div className={cn("w-0.5 bg-(--mo-query)", compact ? "h-4" : "h-6")} />
					</div>
				))}
			</div>
			<div
				data-id="gql-bar"
				className={cn(
					"flex items-center justify-center gap-3 rounded-xl bg-(--mo-gql) text-white",
					compact ? "h-12" : "h-[60px] rounded-2xl",
				)}
			>
				<span className={cn("font-bold", compact ? "text-lg" : "text-[22px]")}>{b.gql}</span>
				<span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
					{b.requests}
				</span>
			</div>
			<ArrowDown
				size={compact ? 24 : 32}
				className={cn("self-center text-(--mo-line-strong)", compact ? "my-2" : "my-2.5")}
			/>
			<div className={cn("grid grid-cols-3", compact ? "gap-2" : "gap-4")}>
				{rows.map((row) => (
					<div
						key={row.label}
						className={cn(
							"rounded-xl border border-(--mo-ok)",
							compact ? "p-2 text-xs text-(--mo-label)" : "px-3.5 py-2.5 text-sm",
						)}
					>
						{compact ? row.value : <MetricRowView row={row} />}
					</div>
				))}
			</div>
			{!compact && (
				<div className="mt-7 flex gap-6 border-t border-(--mo-line) pt-4.5">
					{b.notes.map((note) => (
						<div key={note.title} className="flex-1 text-[13px]">
							<div className="font-bold text-(--mo-label)">{note.title}</div>
							<div className="text-(--mo-muted)">{note.body}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
