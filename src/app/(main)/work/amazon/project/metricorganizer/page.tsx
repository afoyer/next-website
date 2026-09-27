import styles from "./components/index.module.css";
import { MetricOrganizerStory } from "./components/Story";

export default function MetricOrganizerPage() {
	return (
		<div className={styles.page}>
			<MetricOrganizerStory />
		</div>
	);
}
