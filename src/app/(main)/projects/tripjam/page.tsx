import { Caveat } from "next/font/google";
import { TripJamHero } from "./components/hero";
import styles from "./components/index.module.css";
import { BoardSection } from "./components/sections/BoardSection";
import { CtaSection } from "./components/sections/CtaSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { HoodSection } from "./components/sections/HoodSection";
import { Intro } from "./components/sections/Intro";
import { ProcessSection } from "./components/sections/ProcessSection";

// The board's handwriting: the wordmark and every post-it use it.
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export default function TripJam() {
	return (
		<div className={styles.page}>
			<TripJamHero handwriting={caveat.className} />
			<Intro />
			<BoardSection />
			<FeaturesSection handwriting={caveat.className} />
			<ProcessSection />
			<HoodSection />
			<CtaSection />
		</div>
	);
}
