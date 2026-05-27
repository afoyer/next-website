"use client";

import { useRef } from "react";
import CardCols from "./components/card-cols";
import SwatchCard from "./components/pantone-swatch";
import { PantonifyCard } from "./components/pantonify-card";
import TextCard from "./components/text-card";
import { useSpinObserver } from "./hooks/useSpinObserver";
import styles from "./page.module.scss";

export default function Pantonify() {
	const sectionRef = useRef<HTMLDivElement>(null);
	useSpinObserver(sectionRef, {
		section: styles.section,
		pageWrapper: styles["page-wrapper"],
		browser: styles.browser,
	});

	return (
		<>
			<div ref={sectionRef} className="bg-white/90 dark:bg-[#242424]">
				<div className={styles["page-wrapper"]}>
					<section
						className={`${styles.section} ${styles.browser} pantone-card bg-green-500 dark:bg-green-700`}
					>
						<PantonifyCard />
					</section>
				</div>

				<CardCols />
			</div>
		</>
	);
}
