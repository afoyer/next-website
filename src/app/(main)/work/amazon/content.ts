// Single source of truth for the Amazon page. SECTIONS drives the sidebar
// links (`#${id}`) and the section anchors / GSAP `data-id`s. `amazon` holds
// every piece of copy on the page.

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

// ─── Copy ─────────────────────────────────────────────────────────────────────
// All prose for this page. Components render these values verbatim.

export const amazon = {
	role: "Front End Engineer II",
	team: "InfraMap",
	companyUrl: "https://aws.amazon.com/",
	/** Text after the "AWS" link in the overview paragraph. */
	overview:
		"as a front-end engineer, I was responsible for designing and building user interfaces for data center operators (DCO), improving site monitoring and reducing critical failures on equipment before they happen through large scale frameworks and redesigns.",
	lopPlaceholder:
		"Placeholder — describe the Local Access Panel: the on-premises application built for data center operators, what problem it solved, and its architecture.",
} as const;
