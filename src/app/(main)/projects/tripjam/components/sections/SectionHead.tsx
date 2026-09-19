// Centred headline + one-line dek, the rhythm every section below the hero shares.
export function SectionHead({
	heading,
	body,
	tone = "ink",
	maxWidth = "max-w-[720px]",
}: {
	heading: string;
	body?: string;
	tone?: "ink" | "light";
	maxWidth?: string;
}) {
	const dek = tone === "light" ? "text-[#b8b3ac]" : "text-(--t-muted)";
	return (
		<div className="flex flex-col items-center gap-3.5 text-center lg:gap-[18px]">
			<h2
				data-id="split"
				className="text-4xl font-semibold leading-[1.06] tracking-[-0.03em] lg:text-[56px] lg:tracking-[-0.035em]"
			>
				{heading}
			</h2>
			{body && (
				<p
					data-id="reveal"
					className={`${maxWidth} text-[15px] leading-relaxed lg:text-[19px] lg:leading-normal ${dek}`}
				>
					{body}
				</p>
			)}
		</div>
	);
}
