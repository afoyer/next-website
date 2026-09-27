import { Building2, Search } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { stage } from "../../content";
import { CodeBlock } from "../primitives";

// 06 · One UI library over GraphQL, two sets of resolvers.
export function PlatformsStage({ compact }: { compact: boolean }) {
	const p = stage.platforms;
	const column = (side: typeof p.cloud | typeof p.site, tone: "cloud" | "site") => (
		<div
			className={cn(
				"flex flex-col rounded-2xl border",
				compact ? "gap-1.5 rounded-xl p-2.5" : "gap-2.5 p-4",
				tone === "cloud"
					? "border-(--mo-cloud-line) bg-(--mo-cloud-bg)"
					: "border-(--mo-site-line) bg-(--mo-site-bg)",
			)}
		>
			<span
				className={cn(
					"font-bold uppercase tracking-[0.08em]",
					compact ? "text-[10px]" : "text-xs",
					tone === "cloud" ? "text-(--mo-cloud-text)" : "text-(--mo-site-text)",
				)}
			>
				{side.title}
			</span>
			{side.items.map((item, i) => (
				<div
					key={item.name}
					className={cn(
						"rounded-lg bg-(--mo-surface-2) text-(--mo-label)",
						compact ? "px-2 py-1.5 text-xs" : "px-3 py-2.5 text-sm",
						i === 0 && "font-bold",
					)}
				>
					<div className={compact ? undefined : "font-bold"}>
						{item.name}
						{!compact && "note" in item && (
							<span className="font-normal text-(--mo-muted)"> · {item.note}</span>
						)}
					</div>
					{!compact && <div className="font-mono text-[11px] text-(--mo-muted)">{item.detail}</div>}
				</div>
			))}
		</div>
	);

	return (
		<div className={cn("flex flex-col", compact ? "gap-2" : "gap-3")}>
			<div className={cn("flex", compact ? "gap-2 text-[11px]" : "gap-3 text-[13px]")}>
				{p.apps.map((app) => (
					<span
						key={app}
						className={cn(
							"flex-1 rounded-full border border-(--mo-line) text-center text-(--mo-value)",
							compact ? "p-1" : "p-2",
						)}
					>
						{app}
					</span>
				))}
			</div>
			<div
				data-id="mo-bar"
				className={cn(
					"flex items-center justify-between rounded-xl border-2 border-(--mo-accent) bg-(--mo-accent-soft)",
					compact ? "px-3 py-2.5" : "rounded-2xl px-[18px] py-3.5",
				)}
			>
				<span className={cn("font-bold text-(--mo-label)", compact ? "text-sm" : "text-base")}>
					{p.library.name}
					{!compact && <span className="font-normal text-(--mo-muted)"> · {p.library.note}</span>}
				</span>
				<span className="text-[11px] font-bold text-(--mo-accent-text) lg:text-xs">
					{p.library.badge}
				</span>
			</div>
			<div
				data-id="gql-bar"
				className={cn(
					"flex items-center justify-between rounded-xl bg-(--mo-gql) text-white",
					compact ? "px-3 py-2 text-[13px]" : "rounded-2xl px-[18px] py-3",
				)}
			>
				<span className="font-bold">{p.gql.name}</span>
				{!compact && <span className="font-mono text-xs">{p.gql.ops}</span>}
			</div>
			<div className={cn("grid grid-cols-2", compact ? "gap-2" : "gap-3")}>
				{column(p.cloud, "cloud")}
				{column(p.site, "site")}
			</div>
		</div>
	);
}

// 07 · Base template + overrides, resolved for one unit.
export function OverridesStage({ compact }: { compact: boolean }) {
	const o = stage.overrides;
	const query = (
		<div
			className={cn(
				"flex items-center gap-3 rounded-xl border-2 border-(--mo-accent) bg-(--mo-surface) text-(--mo-label)",
				compact ? "px-3 py-2.5 text-[13px] leading-snug" : "px-4 py-3 text-base",
			)}
		>
			{!compact && <Search size={18} className="shrink-0 text-(--mo-muted)" />}
			<span>
				{o.query.map((part, i) =>
					i % 2 === 1 ? (
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed sentence fragments
						<b key={i}>{part}</b>
					) : (
						part
					),
				)}
			</span>
		</div>
	);

	const tree = (
		<ul
			className={cn(
				"flex flex-col",
				compact ? "gap-1 text-[13px]" : "w-[250px] shrink-0 gap-2 text-[15px]",
			)}
		>
			{o.tree.map((node, i) => {
				// Last child when no later sibling appears before the branch closes.
				const next = o.tree.slice(i + 1).find((n) => n.depth <= node.depth);
				const isLast = !next || next.depth < node.depth;
				const glyph = node.depth === 0 ? null : isLast ? "└" : "├";
				return (
					<li
						key={`${node.label}-${node.depth}`}
						className="flex items-center gap-2"
						style={{
							paddingLeft:
								node.depth === 0 ? 0 : (compact ? 12 : 16) + (node.depth - 1) * (compact ? 20 : 26),
						}}
					>
						{node.depth === 0 && !compact && <Building2 size={18} className="text-(--mo-muted)" />}
						{glyph && (
							<span
								className={cn(
									"font-mono",
									node.kind === "match" ? "text-(--mo-accent)" : "text-(--mo-line-strong)",
								)}
							>
								{glyph}
							</span>
						)}
						<span
							className={cn(
								node.depth <= 1 && "font-bold text-(--mo-label)",
								node.kind === "file" &&
									"rounded-lg border border-(--mo-line) px-2.5 py-0.5 text-(--mo-value)",
								node.kind === "room" && "text-(--mo-value)",
								node.kind === "match" &&
									"rounded-lg bg-(--mo-accent) px-3 py-0.5 font-bold text-(--mo-accent-ink)",
								node.kind === "unit" &&
									"rounded-lg border border-(--mo-line) px-3 py-0.5 text-(--mo-muted)",
							)}
						>
							{node.label}
						</span>
						{node.kind === "match" && (
							<span className="text-xs text-(--mo-accent-text)">{o.matchLabel}</span>
						)}
					</li>
				);
			})}
		</ul>
	);

	if (compact) {
		return (
			<div className="flex flex-col gap-3">
				{query}
				{tree}
				<CodeBlock compact lines={o.diff.filter((line) => line.tone)} />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{query}
			<div className="flex items-start gap-7">
				{tree}
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-[0.08em] text-(--mo-muted)">
							{o.resolvedLabel}
						</span>
						<span className="text-xs text-(--mo-ok)">{o.patchedBy}</span>
					</div>
					<CodeBlock lines={o.diff} />
					<span className="text-[13px] text-(--mo-muted)">{o.inherited}</span>
				</div>
			</div>
		</div>
	);
}

// 08 · 50 equipment types, each fanning out level by level.
export function ScaleStage({ compact }: { compact: boolean }) {
	const s = stage.scale;
	const stats = compact ? s.stats.filter((_, i) => i === 0 || i === 2) : s.stats;
	return (
		<div className={cn("flex flex-col", compact ? "gap-2.5" : "gap-5")}>
			<div className="flex flex-col gap-2">
				<div className="flex items-baseline justify-between">
					<span
						className={cn(
							"font-bold uppercase tracking-[0.08em] text-(--mo-muted)",
							compact ? "text-[10px]" : "text-xs",
						)}
					>
						{s.typesLabel}
					</span>
					{!compact && (
						<span className="font-mono text-xs text-(--mo-accent-text)">{s.selectedLabel}</span>
					)}
				</div>
				<div className={cn("grid grid-cols-25", compact ? "gap-0.5" : "gap-1")}>
					{Array.from({ length: s.typesCount }, (_, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative grid
							key={i}
							className={cn(
								"rounded-sm border",
								compact ? "h-2.5" : "h-4",
								i === s.selectedType
									? "border-(--mo-accent) bg-(--mo-accent)"
									: "border-(--mo-line)",
							)}
						/>
					))}
				</div>
			</div>
			<div
				data-id="cascade"
				className={cn(
					"flex flex-col",
					compact ? "gap-1.5" : "gap-3 rounded-2xl border border-(--mo-line) px-5 pt-4 pb-4.5",
				)}
			>
				<div className="flex justify-between">
					{s.tiers.map((tier, i) => (
						<div
							key={tier.name}
							className={cn(
								"flex flex-col",
								i === s.tiers.length - 1 && "items-end",
								compact ? "text-[11px]" : "text-[13px]",
							)}
						>
							<span className="font-bold text-(--mo-label)">{tier.name}</span>
							<span className="font-mono text-(--mo-accent)">{tier.mult}</span>
						</div>
					))}
				</div>
				<Cascade width={compact ? 358 : 640} height={compact ? 170 : 240} />
				{!compact && (
					<div className="flex items-center gap-2 text-[13px] text-(--mo-value)">
						<span className="h-[3px] w-[18px] rounded-sm bg-(--mo-accent)" />
						{s.legend}
					</div>
				)}
			</div>
			<div
				className={cn(
					"grid rounded-2xl border border-(--mo-line)",
					compact ? "grid-cols-2 gap-2 rounded-xl px-3 py-2.5" : "grid-cols-4 gap-5 px-6 py-4",
				)}
			>
				{stats.map((stat) => (
					<div key={stat.label}>
						<div className={cn("font-bold text-(--mo-label)", compact ? "text-[11px]" : "text-sm")}>
							{stat.label}
						</div>
						<div
							className={cn("font-light text-(--mo-accent)", compact ? "text-xl" : "text-[28px]")}
						>
							{stat.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/** Fan-out tree: 1 → 4 → 12 → 24 nodes, with one highlighted branch. */
function Cascade({ width, height }: { width: number; height: number }) {
	const counts = [1, 4, 12, 24];
	const highlighted = [0, 1, 4, 9];
	const pad = width * 0.03;
	const xs = counts.map((_, t) => pad + (t * (width - pad * 2)) / (counts.length - 1));
	const ys = counts.map((n) => Array.from({ length: n }, (_, i) => (height / n) * (i + 0.5)));
	const radius = [11, 8, 6, 5].map((r) => (r * width) / 640);

	const muted: string[] = [];
	const lit: string[] = [];
	for (let t = 0; t < counts.length - 1; t++) {
		const fan = counts[t + 1] / counts[t];
		for (let i = 0; i < counts[t]; i++) {
			for (let j = 0; j < fan; j++) {
				const c = i * fan + j;
				const [x1, y1, x2, y2] = [xs[t], ys[t][i], xs[t + 1], ys[t + 1][c]];
				const mx = (x1 + x2) / 2;
				const d = `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
				(i === highlighted[t] && c === highlighted[t + 1] ? lit : muted).push(d);
			}
		}
	}

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="none"
			aria-hidden="true"
		>
			<path d={muted.join(" ")} stroke="var(--mo-line)" strokeWidth={1} />
			<path d={lit.join(" ")} stroke="var(--mo-accent)" strokeWidth={2} />
			{counts.map((_, t) =>
				ys[t].map((y, i) => {
					const on = i === highlighted[t];
					return (
						<circle
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative nodes
							key={`${t}-${i}`}
							cx={xs[t]}
							cy={y}
							r={radius[t]}
							fill={on ? "var(--mo-accent)" : "var(--mo-surface)"}
							stroke={on ? "var(--mo-accent)" : "var(--mo-line-strong)"}
							strokeWidth={1.5}
						/>
					);
				}),
			)}
		</svg>
	);
}

// 09 · The real editor, as shipped.
export function EditorStage({ compact }: { compact: boolean }) {
	const e = stage.editor;
	return (
		<div className="flex h-full items-center justify-center">
			<Image
				src={e.image}
				alt={e.imageAlt}
				width={e.width}
				height={e.height}
				sizes={compact ? "358px" : "620px"}
				className={cn(
					"h-auto rounded-2xl border border-(--mo-line) shadow-(--mo-shadow)",
					compact ? "max-h-[368px] w-auto rounded-xl" : "max-h-[620px] w-auto",
				)}
			/>
		</div>
	);
}
