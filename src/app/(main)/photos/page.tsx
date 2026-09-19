import { AsciiShimmer } from "@/components/ascii-shimmer";
import PhotosBrowser from "./PhotosBrowser";
import styles from "./photos.module.scss";

export default function Photos() {
	return (
		<div className={styles.page}>
			<AsciiShimmer className="z-0" />
			<PhotosBrowser />
		</div>
	);
}
