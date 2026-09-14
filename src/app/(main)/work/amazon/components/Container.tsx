import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Cloudscape-style bordered container.
export function Container({
	header,
	children,
	className,
}: {
	header?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-foreground/15 bg-foreground/[0.02] px-5 py-5",
				className,
			)}
		>
			{header && <h3 className="mb-4 text-xl font-bold tracking-tight">{header}</h3>}
			<div className="text-[15px] leading-relaxed">{children}</div>
		</div>
	);
}
