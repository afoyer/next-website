import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Cloudscape-style bordered container.
//
// `media` renders full-bleed above the content (Cloudscape's media position
// "top"): the container clips it to a fixed shape, so pass something that
// fills its box, e.g. a `fill` next/image with `object-cover`. `footer` sits
// below a divider.
export function Container({
	header,
	media,
	footer,
	children,
	className,
}: {
	header?: string;
	media?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-2xl border border-foreground/15 bg-foreground/[0.02]",
				className,
			)}
		>
			{media && (
				<div
					data-id="container-media"
					className="relative h-48 w-full overflow-hidden border-b border-foreground/15 bg-foreground/5 sm:h-auto sm:aspect-[7/2]"
				>
					{media}
				</div>
			)}
			<div className="px-5 py-5">
				{header && <h3 className="mb-4 text-xl font-bold tracking-tight">{header}</h3>}
				<div className="text-[15px] leading-relaxed">{children}</div>
			</div>
			{footer && <div className="border-t border-foreground/15 px-5 py-4">{footer}</div>}
		</div>
	);
}
