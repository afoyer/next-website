// Single source of truth for the Amazon page. SECTIONS drives the sidebar
// links (`#${id}`, or `href` when a section lives on its own page) and the
// section anchors / GSAP `data-id`s. `amazon` holds every piece of copy on the page.

export type SectionNode = {
	id: string;
	label: string;
	/** Where the sidebar link goes. Defaults to `#${id}` on the current page. */
	href?: string;
	/** Hide this node's children in the mobile drawer (keeps the menu to main sections). */
	collapseOnMobile?: boolean;
	children?: SectionNode[];
};

export const AMAZON_HREF = "/work/amazon";
export const METRIC_ORGANIZER_HREF = "/work/amazon/project/metricorganizer";

export const SECTIONS: SectionNode[] = [
	{ id: "overview", label: "Overview" },
	{ id: "metric-organizer", label: "MetricOrganizer", href: METRIC_ORGANIZER_HREF },
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
	lopPlaceholder: "Coming Soon.",
	metricOrganizer: {
		summary:
			"MetricOrganizer (a.k.a. MO) is a framework that programmatically manages and lays out metrics based on a configuration, allowing non-technical users to generate their own pages while we handle the backend fetching and resolving of a defined metric on a data center level scale.",
		cta: "Read the full breakdown",
		image: "/images/amazon/mainpage.png",
		imageAlt: "MetricOrganizer UI screenshot",
	},
} as const;
