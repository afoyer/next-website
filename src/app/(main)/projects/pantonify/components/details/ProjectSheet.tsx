"use client";

import { useRef } from "react";
import { pantonify } from "../../content";
import { Eyebrow } from "./Eyebrow";
import { useReveal } from "./useReveal";

const { meta } = pantonify;

function SpecRow({
	label,
	children,
	last,
}: {
	label: string;
	children: React.ReactNode;
	last?: boolean;
}) {
	return (
		<div
			data-id="reveal"
			className={`flex flex-col gap-1 py-4 ${last ? "" : "border-b border-(--p-line)"}`}
		>
			<span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--p-muted) lg:text-[11px]">
				{label}
			</span>
			<span className="text-sm font-medium leading-snug lg:text-[15px]">{children}</span>
		</div>
	);
}

// 01 — statement + spec table.
export function ProjectSheet() {
	const ref = useRef<HTMLElement>(null);
	useReveal(ref);

	return (
		<section
			ref={ref}
			className="page grid grid-cols-1 gap-8 border-b border-(--p-line) py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-24"
		>
			<div className="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
				<Eyebrow>Project sheet · 01</Eyebrow>
				<h1
					data-id="split"
					className="max-w-[880px] text-[30px] font-bold leading-[1.08] tracking-[-0.025em] lg:text-[52px] lg:leading-[1.04]"
				>
					{pantonify.introHeading}
				</h1>
				<p
					data-id="reveal"
					className="max-w-[720px] text-[15px] leading-normal text-(--p-muted) lg:text-lg"
				>
					{pantonify.introSubHeading}
				</p>
			</div>

			<div
				data-id="reveal-group"
				className="grid grid-cols-2 gap-x-4 self-start pt-1 lg:col-span-3 lg:col-start-10 lg:grid-cols-1"
			>
				<div data-id="rule" className="col-span-full h-0.5 bg-(--p-ink)" />
				<SpecRow label="Role">{meta.role}</SpecRow>
				<SpecRow label="Year">{meta.year}</SpecRow>
				<div className="col-span-full lg:col-span-1">
					<SpecRow label="Stack">{meta.stack}</SpecRow>
				</div>
				<SpecRow label="Swatch">
					<span className="flex items-center gap-2">
						<span className="inline-block size-3 bg-(--p-accent) lg:size-3.5" />
						{meta.swatch}
					</span>
				</SpecRow>
				<SpecRow label="Source" last>
					<a
						href={meta.sourceUrl}
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-3 hover:text-(--p-accent)"
					>
						{meta.sourceLabel} ↗
					</a>
				</SpecRow>
			</div>
		</section>
	);
}
