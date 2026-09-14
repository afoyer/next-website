import type { ReactNode } from "react";

// Anchor target for a sidebar link. `data-id` is the hook for future GSAP work.
export function Section({
	id,
	title,
	level = 2,
	children,
}: {
	id: string;
	title: string;
	level?: 2 | 3;
	children: ReactNode;
}) {
	const Heading = level === 2 ? "h2" : "h3";
	return (
		<section id={id} data-id={`section-${id}`} className="scroll-mt-32 flex flex-col gap-4">
			<Heading className={level === 2 ? "text-xl font-bold" : "text-lg font-semibold"}>
				{title}
			</Heading>
			{children}
		</section>
	);
}
