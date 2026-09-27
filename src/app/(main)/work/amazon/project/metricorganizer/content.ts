// Single source of truth for the MetricOrganizer story page.
//
// CHAPTERS are the carousel slides: each one is the text beside the stage
// (below it on mobile, using `short`) and an anchor the sidebar links to. `stage`
// holds the data every stage visual renders, so labels, values and code
// samples can be edited here without touching components.

import { AMAZON_HREF, SECTIONS, type SectionNode } from "../../content";

export type Chapter = {
	id: string;
	label: string;
	title: string;
	/** One string per paragraph. */
	body: string[];
	/** Shorter copy for the mobile panel under the stage. */
	short: string;
	details?: { term: string; value: string }[];
};

export const CHAPTERS: Chapter[] = [
	{
		id: "mo-overview",
		label: "Overview",
		title: "Every page is generated, not built.",
		short:
			"MetricOrganizer lays out metrics from a configuration. Non-technical users describe the page, and we fetch and resolve every metric at data-center scale. Scroll to take this one apart.",
		body: [
			"MetricOrganizer (MO) is a framework that lays out metrics from a configuration. Non-technical users describe the page, and we handle fetching and resolving every metric at data-center scale.",
			"This is what a data center operator sees. Scroll to take it apart.",
		],
		details: [
			{ term: "Role", value: "Front End Engineer II" },
			{ term: "Team", value: "InfraMap" },
		],
	},
	{
		id: "mo-problem",
		label: "The problem",
		title: "The data arrives flat.",
		short:
			"Every data center is set up differently, and inventory is stored as a plain relation list: controllers contain metrics, metrics belong to equipment. Nothing says what a metric means or where it goes on a screen.",
		body: [
			"Each data center has its own equipment setup, often unique to that building. On top of that, inventory data is stored as a simple relation list: a controller contains metrics, and metrics are associated with equipment.",
			"Nothing says what a metric means or where it belongs on a screen. To build contextual dashboards, we needed a configurable way to lay out and display metrics in any format, with simpler querying and standard formats.",
		],
	},
	{
		id: "mo-card",
		label: "Anatomy of a card",
		title: "Each part of the UI is a widget.",
		short:
			"A page is a grid of widgets, and each widget is a small piece of config. This CARD has a header, columns, and the points inside them. Change the config and the card follows.",
		body: [
			"A page is a grid of widgets, and each widget is a small piece of configuration that can be tuned to a data center’s metric needs.",
			"This card is a CARD widget: a header, a set of columns, and the points inside them. Change the config and the card changes with it, with no new code.",
		],
	},
	{
		id: "mo-point",
		label: "A single point",
		title: "A point describes how it looks and where its value comes from.",
		short:
			"Each point defines its format (is) and its fetch (query) separately, so any format works with any source. Alongside STRING_ENUM, points can be METRIC, RANGE, STRING_CONCAT or AVERAGE.",
		body: [
			"Going down the configuration, each point defines how it is formatted (is) and how it is fetched (query).",
			"Because the two are independent, any format works with any source. Alongside STRING_ENUM, points can be METRIC, RANGE, STRING_CONCAT or AVERAGE.",
		],
		details: [
			{ term: "is", value: "The format: METRIC, RANGE, STRING_ENUM, STRING_CONCAT, AVERAGE" },
			{ term: "query", value: "The fetch: which resolver and which key" },
		],
	},
	{
		id: "mo-batching",
		label: "Batching",
		title: "Many points, one request.",
		short:
			"When a widget renders, it gathers its points’ queries into a single GraphQL call. Each widget asks only for what it shows, so the page fills in progressively.",
		body: [
			"When a widget renders, it collects the queries of its points and resolves them in a single GraphQL call to our backend.",
			"Each widget asks only for what it shows, which keeps queries small and lets the page fill in progressively.",
		],
	},
	{
		id: "mo-platforms",
		label: "Two platforms",
		title: "One library, two homes.",
		short:
			"The same component runs in the cloud app and on the Local Access Panel in each data center. Only the resolvers change. Sharing it halved our code and kept both apps type-safe.",
		body: [
			"The same MetricOrganizer component runs in the regional cloud app and on the Local Access Panel inside each data center. Only the resolvers behind GraphQL change.",
			"Sharing one component cut our code in half and kept both apps type-safe and consistent.",
		],
		details: [
			{ term: "Data processors", value: "3 per site, deployed one at a time to avoid downtime" },
			{
				term: "Inventory cache",
				value: "The previous copy is kept in case a new one is corrupted",
			},
			{ term: "Freshness", value: "Staleness fallbacks and heartbeat logs" },
		],
	},
	{
		id: "mo-overrides",
		label: "Templates & overrides",
		title: "One template, patched where needed.",
		short:
			"Even one building has variations. We write a base template for all fans, then apply overrides for unique cases, down to a single room or unit.",
		body: [
			"A data center can vary even within its own walls. To keep the number of configurations small, we write one base template for all fans, then apply overrides for the unique cases, down to a single room or unit.",
		],
		details: [
			{ term: "Lookup", value: "Site › equipment type › room › unit" },
			{ term: "Result", value: "Base template + matching overrides, merged at request time" },
		],
	},
	{
		id: "mo-scale",
		label: "At scale",
		title: "Scale that cascades.",
		short:
			"50 equipment types, one template each. Every level multiplies the one below, and the same template, context and id resolve them all, down to hundreds of thousands of metrics.",
		body: [
			"MetricOrganizer covers 50 equipment types, each described by a single template. Every level of the hierarchy multiplies the one below it: one unit branches into many parts, and each of those connects to many more.",
			"Because the same template, parent context and id resolve every level, hundreds of thousands of metrics across more than 50 data centers come from a small set of files.",
		],
	},
	{
		id: "mo-editor",
		label: "Editing in place",
		title: "Handing the keys to site teams.",
		short:
			"An in-browser editor built on the same library suggests metrics and guards against bad configs. Commissioning a new site no longer needs the dev team.",
		body: [
			"On top of the same library, I designed an in-browser editor to configure new data centers. It suggests metrics, guards against invalid configs, and edits overrides in place.",
			"The development team no longer owns the commissioning of new sites.",
		],
		details: [
			{ term: "Before", value: "Every new site needed an engineer to write JSON" },
			{ term: "After", value: "Sites are configured visually, with guardrails" },
		],
	},
];

// ─── Page chrome ──────────────────────────────────────────────────────────────

export const metricOrganizer = {
	title: "MetricOrganizer",
	sidebarTitle: "Work",
	breadcrumb: [
		{ label: "Amazon", href: AMAZON_HREF },
		{ label: "Work", href: `${AMAZON_HREF}#overview` },
	],
	scrollHint: "Scroll to continue",
	previous: "Previous",
	next: "Next",
	back: { label: "Back to Amazon", href: AMAZON_HREF },
} as const;

/**
 * The Amazon sidebar, re-pointed from this page: sibling sections link back to
 * /work/amazon, and MetricOrganizer expands into the chapters (desktop only).
 */
export const MO_SECTIONS: SectionNode[] = SECTIONS.map((section) =>
	section.id === "metric-organizer"
		? {
				...section,
				href: `#${CHAPTERS[0].id}`,
				collapseOnMobile: true,
				children: CHAPTERS.map((c) => ({ id: c.id, label: c.label })),
			}
		: {
				...section,
				href: section.href ?? `${AMAZON_HREF}#${section.id}`,
				children: section.children?.map((c) => ({ ...c, href: `${AMAZON_HREF}#${c.id}` })),
			},
);

// ─── Stage data ───────────────────────────────────────────────────────────────

export type MetricRow = { label: string; value: string; tone?: "ok"; source?: string };
export type MetricCardData = { title: string; rows: readonly MetricRow[] };
export type CodeLine = { text: string; note?: string; tone?: "format" | "fetch" | "add" | "del" };

const command: MetricCardData = {
	title: "Command",
	rows: [
		{ label: "System Mode", value: "Tank Mode" },
		{ label: "Fan Speed Cmd", value: "99.86 %" },
		{ label: "Critical Alarm", value: "Off" },
	],
};

export const stage = {
	dashboard: {
		tabs: ["Unit overview", "Trends", "Alarms", "Diagram"],
		cards: [
			{
				title: "System Information",
				rows: [
					{ label: "Unit", value: "DAHU 1.2-018" },
					{ label: "Location", value: "Seattle 1 · Room 1" },
					{ label: "Status", value: "● On", tone: "ok" },
				],
			},
			command,
			{
				title: "Supply Air",
				rows: [
					{ label: "SA Temp", value: "66.27 °F" },
					{ label: "Static Pressure", value: "0.12 IWC" },
					{ label: "Humidity", value: "47.90 %RH" },
				],
			},
			{
				title: "Return Air",
				rows: [
					{ label: "RA Temp", value: "87.98 °F" },
					{ label: "Diff. Pressure", value: "0.08 IWC" },
					{ label: "Humidity", value: "51.94 %RH" },
				],
			},
		] satisfies readonly MetricCardData[],
		caption: "Seattle 1 › FAN › Unit A · rendered from one configuration",
	},
	problem: {
		relation: {
			nodes: ["Controller", "Metrics", "Equipment"],
			edges: ["contains", "is associated to"],
		},
		have: "What the inventory gives us",
		haveCaption: "No context about what each metric means. Just a flat list.",
		ids: [
			"AI-12",
			"AV-14",
			"BI-3",
			"BV-7",
			"MSV-2",
			"AO-4",
			"AV-22",
			"BI-9",
			"AI-31",
			"AV-5",
			"MSV-8",
			"S0-W0-c0-P0",
			"AI-7",
			"BV-11",
			"…",
		],
		need: "What an operator needs",
		needCaption: "Named, grouped, formatted.",
		// The same Command card the story follows, now with the raw ids it's built from.
		card: {
			title: command.title,
			rows: [
				{ ...command.rows[0], source: "MSV-2" },
				{ ...command.rows[1], source: "AO-4" },
				{ ...command.rows[2], source: "BI-9" },
			],
		} satisfies MetricCardData,
	},
	card: {
		card: command,
		lifted: "The Command widget, lifted out of the page",
		code: [
			{ text: "{" },
			{ text: '  is: "CARD",' },
			{ text: '  header: "Command",', note: "① title" },
			{ text: "  columns: [", note: "② layout" },
			{ text: "    {" },
			{ text: "      points: [ … ]", note: "③ rows" },
			{ text: "    }" },
			{ text: "  ]" },
			{ text: "}" },
		] satisfies readonly CodeLine[],
		legend: [
			{ key: "① header", value: "What the card is called" },
			{ key: "② columns", value: "How its content is laid out" },
			{ key: "③ points", value: "The metrics it shows" },
		],
	},
	point: {
		card: command,
		code: [
			{ text: "{" },
			{ text: '  fallbackName: "SystemMode",' },
			{ text: '  is: "STRING_ENUM",', tone: "format" },
			{ text: "  mapping: {", tone: "format" },
			{ text: '    1: "Shutdown",', tone: "format" },
			{ text: '    2: "Tank Mode",', tone: "format" },
			{ text: '    3: "Utility Mode"', tone: "format" },
			{ text: "  },", tone: "format" },
			{ text: "  query: {", tone: "fetch" },
			{ text: '    is: "vendorName",', tone: "fetch" },
			{ text: '    vendorName: "SystemMode"', tone: "fetch" },
			{ text: "  }", tone: "fetch" },
			{ text: "}" },
		] satisfies readonly CodeLine[],
		format: { tag: "FORMAT", label: "how it looks" },
		fetch: { tag: "FETCH", label: "where the value comes from" },
		transform: [
			{ label: "Raw value", value: "2" },
			{ label: "STRING_ENUM", value: "mapping[2]" },
			{ label: "On screen", value: "Tank Mode" },
		],
		alsoLabel: "Also supported",
		also: ["METRIC", "RANGE", "STRING_CONCAT", "AVERAGE"],
	},
	batching: {
		caption: "Command widget · on render",
		query: "query",
		gql: "GraphQL",
		requests: "1 request",
		notes: [
			{ title: "Collected per widget", body: "A widget only asks for the points it shows." },
			{
				title: "Keyed by fetch type",
				body: "Each point's query decides which resolver answers it.",
			},
			{
				title: "Rendered independently",
				body: "A slow widget never holds up the rest of the page.",
			},
		],
	},
	platforms: {
		apps: ["Cloud app", "Local Access Panel"],
		library: { name: "MetricOrganizer", note: "one shared UI library", badge: "½ THE CODE" },
		gql: { name: "GraphQL schema & resolvers", ops: "GetConfig · GetMetrics · GetEquipment" },
		cloud: {
			title: "Cloud (regional)",
			items: [
				{ name: "Lambda", detail: "resolves every query in the cloud" },
				{ name: "S3 configurations (JSON)", detail: "GetConfigFromS3" },
				{ name: "Cloud data aggregation", note: "sister team", detail: "GetMetricsFromCloud" },
				{
					name: "Equipment inventory",
					note: "sister team",
					detail: "GetEquipmentFromInventoryCloud",
				},
			],
		},
		site: {
			title: "Data center (on site)",
			items: [
				{ name: "Node.js server", detail: "same resolvers, local sources" },
				{ name: "Equipment configurations", detail: "GetConfigFromLocal · shipped on deploy" },
				{ name: "InfluxDB", note: "← MQTT ← live telemetry", detail: "GetMetricsLocal" },
				{ name: "Redis cache", note: "inventory", detail: "GetEquipmentFromInventoryLocal" },
			],
		},
	},
	overrides: {
		query: [
			"Get me the ",
			"Fan",
			" configuration for ",
			"Seattle 1",
			", ",
			"Room 1",
			", unit ",
			"A",
		],
		tree: [
			{ label: "Seattle 1", depth: 0, kind: "site" },
			{ label: "FAN", depth: 1, kind: "type" },
			{ label: "Base config", depth: 2, kind: "file" },
			{ label: "Overrides", depth: 2, kind: "file" },
			{ label: "Room 1", depth: 3, kind: "room" },
			{ label: "A", depth: 4, kind: "match" },
			{ label: "B", depth: 4, kind: "unit" },
		] as const,
		matchLabel: "match",
		resolvedLabel: "Resolved config · Fan A",
		patchedBy: "patched by Room 1 › A",
		diff: [
			{ text: '  header: "Command",' },
			{ text: "  points: [" },
			{ text: '    fallbackName: "SystemMode",' },
			{ text: '-   vendorName: "SystemMode"', tone: "del" },
			{ text: '+   vendorName: "SysMode_R1A"', tone: "add" },
			{ text: "    …" },
			{ text: "  ]" },
		] satisfies readonly CodeLine[],
		inherited: "Everything else is inherited from the base template.",
	},
	scale: {
		typesLabel: "50 equipment types · one template each",
		typesCount: 50,
		selectedType: 6,
		selectedLabel: "type 07 selected",
		tiers: [
			{ name: "Unit", mult: "1" },
			{ name: "Level 2", mult: "× n" },
			{ name: "Level 3", mult: "× n²" },
			{ name: "Metrics", mult: "× n³" },
		],
		legend: "One branch, resolved from its type's template plus its parent's context and id",
		stats: [
			{ label: "Equipment types", value: "50" },
			{ label: "Templates per type", value: "1" },
			{ label: "Metrics", value: "100,000s" },
			{ label: "Data centers", value: "50+" },
		],
	},
	editor: {
		image: "/images/amazon/editing.jpg",
		imageAlt:
			"The MetricOrganizer point configuration editor, open over a data hall floor plan: point type, metric lookup, fallback name, queries and controller overrides.",
		width: 1130,
		height: 1208,
	},
} as const;
