// Single source of truth for the Amazon page's sections. Drives both the
// sidebar links (`#${id}`) and the section anchors / GSAP `data-id`s.

export type SectionNode = {
	id: string;
	label: string;
	children?: SectionNode[];
};

export const SECTIONS: SectionNode[] = [
	{ id: "overview", label: "Overview" },
	{ id: "lop", label: "LOP" },
	{ id: "metric-organizer", label: "MetricOrganizer" },
	{
		id: "projects",
		label: "Projects",
		children: [
			{ id: "projects-page-1", label: "Page_name" },
			{ id: "projects-page-2", label: "Page_name" },
		],
	},
];
