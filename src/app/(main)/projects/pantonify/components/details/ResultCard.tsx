import Image from "next/image";
import { pantonify, type Song } from "../../content";
import styles from "./index.module.css";

const { card } = pantonify.result;

// One swatch: colour band (cover ghosted on the right) + Pantone-style label.
function Swatch({ song }: { song: Song }) {
	return (
		<div className="flex flex-col">
			<div
				data-id="result-band"
				className="relative aspect-[283/86] w-full overflow-hidden"
				style={{ backgroundColor: `#${song.hex}` }}
			>
				<Image
					src={song.img}
					alt=""
					fill
					sizes="100px"
					className="left-auto! w-[31%]! object-cover opacity-25"
				/>
			</div>
			<div className="flex items-start justify-between gap-3 px-3.5 pb-3 pt-2 text-[#121212] lg:px-4 lg:pb-3.5 lg:pt-2.5">
				<div className="flex flex-col gap-px">
					<span className="text-[11px] font-black leading-tight tracking-[-0.01em] lg:text-[13px]">
						{song.artist}
					</span>
					<span className="text-[9.5px] font-bold leading-tight tracking-[0.02em] opacity-75 lg:text-[11px]">
						{song.pantone}
						<span className="font-medium opacity-70"> · {song.pantoneName}</span>
					</span>
				</div>
				<span className="max-w-[45%] text-right text-[9.5px] font-light leading-snug opacity-85 lg:text-[11px]">
					{song.title}
				</span>
			</div>
		</div>
	);
}

// The Pantonify result rebuilt as a Pantone chip: white stock, square corners,
// the hero card's hard shadow, one swatch per track. Two blank chips sit behind
// it and fan out on reveal (GSAP targets `result-fan`).
export function ResultCard({ period }: { period: string }) {
	return (
		<div data-id="result-card" className="relative w-60 lg:w-[300px]">
			{/* Fan-deck chips behind — rotate around the bottom-left corner. */}
			<div
				data-id="result-fan"
				aria-hidden="true"
				className={`${styles.chip} absolute inset-0 flex flex-col bg-white`}
			>
				<div className="flex-1 bg-[#121212]" />
				<div className="h-12 lg:h-14" />
			</div>
			<div
				data-id="result-fan"
				aria-hidden="true"
				className={`${styles.chip} absolute inset-0 flex flex-col bg-white`}
			>
				<div className="flex-1 bg-(--p-accent)" />
				<div className="h-12 lg:h-14" />
			</div>

			{/* The card itself. */}
			<div className={`${styles.chip} relative flex flex-col bg-white text-[#121212]`}>
				<div className="flex flex-col gap-0.5 px-3.5 pb-2.5 pt-3.5 lg:px-4 lg:pb-3 lg:pt-4">
					<span className="text-[15px] font-black tracking-[-0.01em] lg:text-lg">PANTONIFY©</span>
					<span className="text-[8.5px] font-bold uppercase tracking-[0.14em] opacity-60 lg:text-[10px]">
						{card.eyebrow} · {period}
					</span>
				</div>

				{pantonify.songs.map((song) => (
					<Swatch key={song.title} song={song} />
				))}

				<div className="flex items-center px-3.5 pb-3.5 pt-1 lg:px-4 lg:pb-4">
					<span className="text-[8px] font-medium opacity-60 lg:text-[9px]">{card.footer}</span>
				</div>
			</div>
		</div>
	);
}
