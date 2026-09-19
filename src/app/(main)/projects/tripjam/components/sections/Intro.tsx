"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { tripjam } from "../../content";

const { intro } = tripjam;

function Dot() {
	return <span className="hidden size-[3px] rounded-full bg-(--t-muted) lg:block" />;
}

// 01 — the statement, and one quiet meta line under it.
export function Intro() {
	const ref = useRef<HTMLElement>(null);
	useReveal(ref);

	return (
		<section
			ref={ref}
			className="flex flex-col items-center gap-5 px-7 pb-18 pt-22 text-center lg:gap-7 lg:px-[170px] lg:pb-30 lg:pt-[150px]"
		>
			<h2
				data-id="split"
				className="max-w-[900px] text-[40px] font-semibold leading-[1.06] tracking-[-0.03em] lg:text-[68px] lg:leading-[1.04] lg:tracking-[-0.035em]"
			>
				{intro.heading}
			</h2>
			<p
				data-id="reveal"
				className="max-w-[720px] text-base leading-relaxed text-(--t-muted) lg:text-[21px] lg:leading-normal"
			>
				{intro.body}
			</p>
			<div
				data-id="reveal"
				className="mt-1.5 flex flex-col items-center gap-2 text-[13px] font-medium text-(--t-muted) lg:mt-3 lg:flex-row lg:gap-7 lg:text-sm"
			>
				<span>
					{intro.meta.role}
					<span className="lg:hidden"> · {tripjam.event}</span>
				</span>
				<Dot />
				<span className="hidden lg:inline">{tripjam.event}</span>
				<Dot />
				<span>{intro.meta.team}</span>
				<Dot />
				<a
					href={intro.meta.sourceUrl}
					target="_blank"
					rel="noreferrer"
					className="font-semibold text-(--t-accent) hover:underline"
				>
					{intro.meta.sourceLabel} ↗
				</a>
			</div>
		</section>
	);
}
