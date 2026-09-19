import styles from "../index.module.css";

// A Liveblocks-style presence cursor: arrow plus a coloured name tag.
export function CursorTag({
	name,
	color,
	size = 22,
}: {
	name: string;
	color: string;
	size?: number;
}) {
	return (
		<div className="flex items-start gap-0.5">
			<svg width={size} height={size * 1.1} viewBox="0 0 16 22" aria-hidden="true">
				<path
					d="M2 2 L2 18 L6.5 13.5 L9.5 20 L12 19 L9 12.5 L15 12.5 Z"
					fill={color}
					stroke="#ffffff"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			</svg>
			<span
				className={`${styles.mono} mt-3.5 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white md:text-xs`}
				style={{ backgroundColor: color }}
			>
				{name}
			</span>
		</div>
	);
}
