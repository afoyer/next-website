import Image from "next/image";

import { pantonify, type Song } from "../../content";
import styles from "./index.module.css";

export default function SwatchCard() {
	return (
		<div className={`${styles.swatch} shadow-xl`}>
			<h1 className={`${styles.title} font-helvetica`}>PANTONIFY</h1>
			{pantonify.songs.map((song) => {
				return <SongRow song={song} key={song.title} />;
			})}
			<div className={styles["swatch-end"]} />
		</div>
	);
}

function SongRow({ song }: { song: Song }) {
	return (
		<>
			{/* COLOR PATTERN */}
			<div
				className={styles["color-pattern"]}
				style={{ backgroundColor: `#${song.hex}` }}
				key={"color" + song.title}
			>
				<div className={styles.swatch_image}>
					<Image fill className="object-fit" src={song.img} alt={song.title} />
				</div>
			</div>
			{/* SONG INFO */}
			<div className={styles["song-info"]} key={"info" + song.title}>
				<div className={styles["artist-hex"]}>
					<p>{song.artist}</p>
					<p>{song.hex}</p>
				</div>
				<div className={styles["song-name"]}>
					<p>{song.title}</p>
				</div>
			</div>
		</>
	);
}
