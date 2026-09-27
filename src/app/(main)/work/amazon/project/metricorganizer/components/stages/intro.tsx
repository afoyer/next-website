import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { stage } from "../../content";
import { Chip, COMMAND_CARD_FLIP_ID, Eyebrow, MetricCard } from "../primitives";

// 01 · The page an operator sees.
export function DashboardStage({ compact }: { compact: boolean }) {
	const { tabs, cards, caption } = stage.dashboard;
	return (
		<div className={cn("flex flex-col", compact ? "gap-2.5" : "gap-4")}>
			<div
				className={cn(
					"flex border-b border-(--mo-line) font-bold",
					compact ? "text-[13px]" : "text-[15px]",
				)}
			>
				{tabs.slice(0, compact ? 3 : tabs.length).map((tab, i) => (
					<span
						key={tab}
						className={cn(
							compact ? "px-2.5 py-1.5" : "px-4 py-2",
							i === 0
								? "border-b-[3px] border-(--mo-accent) text-(--mo-accent)"
								: "text-(--mo-muted)",
						)}
					>
						{tab}
					</span>
				))}
			</div>
			<div className={cn("grid grid-cols-2", compact ? "gap-2" : "gap-3")}>
				{cards.map((card) => (
					<MetricCard
						key={card.title}
						dataId={card.title === "Command" ? "card-command" : undefined}
						flipId={card.title === "Command" ? COMMAND_CARD_FLIP_ID : undefined}
						compact={compact}
						card={compact ? { ...card, rows: card.rows.slice(0, 2) } : card}
					/>
				))}
			</div>
			<span className="font-mono text-[11px] text-(--mo-muted) lg:text-xs">{caption}</span>
		</div>
	);
}

// 02 · Flat inventory → contextual card.
export function ProblemStage({ compact }: { compact: boolean }) {
	const p = stage.problem;
	const relation = (
		<div
			className={cn(
				"flex items-center justify-center font-bold text-(--mo-label)",
				compact ? "justify-between text-xs" : "py-5",
			)}
		>
			{p.relation.nodes.map((node, i) => (
				<div key={node} className={cn("flex items-center", compact && i > 0 && "grow")}>
					{i > 0 && (
						<div
							className={cn(
								"flex flex-col items-center",
								compact ? "grow px-1" : i === 1 ? "w-32" : "w-36",
							)}
						>
							{!compact && (
								<span className="text-xs font-normal text-(--mo-muted)">
									{p.relation.edges[i - 1]}
								</span>
							)}
							<div className="h-0.5 w-full bg-(--mo-line-strong)" />
						</div>
					)}
					<span
						className={cn(
							"rounded-full border-2 border-(--mo-line-strong)",
							compact ? "px-2.5 py-1.5" : "px-5 py-3",
						)}
					>
						{node}
					</span>
				</div>
			))}
		</div>
	);

	const flat = (
		<div
			className={cn(
				"flex flex-wrap rounded-2xl border border-dashed border-(--mo-line-strong)",
				compact ? "gap-1.5 rounded-xl p-3 text-xs" : "gap-2 p-4 text-[13px]",
			)}
		>
			{p.ids.slice(0, compact ? 10 : p.ids.length).map((id) => (
				<Chip key={id} mono className={compact ? "px-2 py-0.5" : undefined}>
					{id}
				</Chip>
			))}
		</div>
	);

	if (compact) {
		return (
			<div className="flex flex-col gap-3">
				{relation}
				{flat}
				<ArrowDown size={20} className="self-center text-(--mo-accent)" />
				<MetricCard
					compact
					highlight
					showSource
					flipId={COMMAND_CARD_FLIP_ID}
					card={{ ...p.card, rows: p.card.rows.slice(0, 2) }}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-7">
			{relation}
			<div className="flex items-center gap-5">
				<div className="flex flex-1 flex-col gap-3">
					<Eyebrow>{p.have}</Eyebrow>
					{flat}
					<span className="text-[13px] text-(--mo-muted)">{p.haveCaption}</span>
				</div>
				<ArrowRight size={32} className="shrink-0 text-(--mo-accent)" />
				<div className="flex w-[250px] flex-col gap-3">
					<Eyebrow>{p.need}</Eyebrow>
					<MetricCard highlight showSource flipId={COMMAND_CARD_FLIP_ID} card={p.card} />
					<span className="text-[13px] text-(--mo-muted)">{p.needCaption}</span>
				</div>
			</div>
		</div>
	);
}
