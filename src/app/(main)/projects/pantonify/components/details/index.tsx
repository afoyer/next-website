"use client";

import { useRef } from "react";
import { CtaSection } from "./CtaSection";
import { DecisionsSection } from "./DecisionsSection";
import styles from "./index.module.css";
import { PipelineSection } from "./PipelineSection";
import { ProcessSection } from "./ProcessSection";
import { ProjectSheet } from "./ProjectSheet";
import { ResultSection } from "./ResultSection";
import { useSectionSnap } from "./useSectionSnap";

// Everything below the hero: sheet → result → process → pipeline → decisions → CTA.
// Each child is a snap target — see useSectionSnap.
export function PantonifyDetails() {
	const ref = useRef<HTMLDivElement>(null);
	useSectionSnap(ref);

	return (
		<div ref={ref} className={styles.details}>
			<ProjectSheet />
			<ResultSection />
			<ProcessSection />
			<PipelineSection />
			<DecisionsSection />
			<CtaSection />
		</div>
	);
}
