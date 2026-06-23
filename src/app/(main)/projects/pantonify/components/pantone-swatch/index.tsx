import Image from "next/image";

import styles from "./index.module.css";

type Song = {
	hex: string;
	artist: string;
	title: string;
	img: string;
};

const songs: Song[] = [
	{
		hex: "242525",
		artist: "DAFT PUNK",
		title: "Give Life Back To Music",
		img: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png",
	},
	{
		hex: "4E4546",
		artist: "DUA LIPA",
		title: "Levitating",
		img: "https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
	},
];

export default function SwatchCard() {
	return (
		<div className={`${styles.swatch} shadow-xl`}>
			<h1 className={`${styles.title} font-helvetica`}>PANTONIFY</h1>
			{songs.map((song) => {
				return <Song song={song} key={song.title} />;
			})}
			<div className={styles["swatch-end"]} />
		</div>
	);
}

function Song({ song }: { song: Song }) {
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
