// "── PROJECT SHEET · 01" section label. `tone` flips it for the dark section.
export function Eyebrow({ children, tone = "ink" }: { children: string; tone?: "ink" | "accent" }) {
	const color = tone === "accent" ? "text-(--p-accent)" : "text-(--p-muted)";
	const rule = tone === "accent" ? "bg-(--p-accent)" : "bg-(--p-ink)";
	return (
		<div
			data-id="reveal"
			className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] lg:text-xs ${color}`}
		>
			<span data-id="rule" className={`h-px w-6 lg:w-7 ${rule}`} />
			<span>{children}</span>
		</div>
	);
}
