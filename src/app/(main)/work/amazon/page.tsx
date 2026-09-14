"use client";

import { ChevronRight } from "lucide-react";
import { MetricOrganizerContent } from "./components/MetricOrganizerContent";
import { OverviewCard } from "./components/OverviewCard";
import { Placeholder } from "./components/Placeholder";
import { Section } from "./components/Section";
import { Sidebar } from "./components/Sidebar";
import { amazon, SECTIONS } from "./content";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AmazonPage() {
	const projects = SECTIONS.find((s) => s.id === "projects")?.children ?? [];

	return (
		<div className="flex min-h-screen flex-col px-4 pt-28 lg:flex-row lg:px-0 lg:pt-32">
			<Sidebar title="Work" sections={SECTIONS} />

			<div className="flex min-w-0 flex-1 flex-col gap-8 py-6 lg:px-12 lg:py-4">
				{/* Breadcrumb */}
				<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
					<a href="#overview" className="text-nav-accent underline underline-offset-2">
						Amazon
					</a>
					<ChevronRight size={14} className="text-foreground/50" />
					<span className="text-foreground/60">Experience</span>
				</nav>

				<Section id="overview" title="Amazon">
					<OverviewCard />
				</Section>

				<Section id="lop" title="Local Access Panel">
					<Placeholder>{amazon.lopPlaceholder}</Placeholder>
				</Section>

				<Section id="metric-organizer" title="MetricOrganizer">
					<MetricOrganizerContent />
				</Section>

				<Section id="projects" title="Projects">
					{projects.map((project, i) => (
						<Section key={project.id} id={project.id} title={project.label} level={3}>
							<Placeholder>{`Placeholder — project ${i + 1} details.`}</Placeholder>
						</Section>
					))}
				</Section>
			</div>
		</div>
	);
}
