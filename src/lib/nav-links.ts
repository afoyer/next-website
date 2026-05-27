export type NavItem = {
	label: string;
	href: string;
	gradient: string;
	preview?: string;
	external?: boolean;
};

export type NavSection = {
	id: "main" | "projects" | "work";
	label: string;
	items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
	{
		id: "main",
		label: "me",
		items: [
			{ label: "about", href: "/about", gradient: "#888", preview: "/images/gifs/about-ascii.gif" },
			{
				label: "linkedin",
				href: "https://www.linkedin.com/in/aymeric-foyer/",
				gradient: "#778",
				preview: "/images/gifs/linkedin-ascii.gif",
				external: true,
			},
			{
				label: "photos",
				href: "/photos",
				gradient: "#4a72a0",
				preview: "/images/gifs/photos-ascii.gif",
			},
			{
				label: "resume",
				href: "/resume",
				gradient: "#4a72a0",
				preview: "/images/gifs/resume-ascii.gif",
			},
		],
	},
	{
		id: "projects",
		label: "projects",
		items: [
			{
				label: "pantonify",
				href: "/projects/pantonify",
				gradient: "#307050",
				preview: "/images/gifs/pantonify-ascii.gif",
			},
			{
				label: "radiosity",
				href: "/projects/radiosity",
				gradient: "#904030",
				preview: "/images/gifs/radiosity-ascii.gif",
			},
			{
				label: "presence of light",
				href: "/projects/presence",
				gradient: "#6050a0",
				preview: "/images/gifs/presence-ascii.gif",
			},
		],
	},
	{
		id: "work",
		label: "work",
		items: [
			{
				label: "amazon",
				href: "/work/amazon",
				gradient: "#906020",
				preview: "/images/gifs/aws-ascii.gif",
			},
		],
	},
];

export type Tab = NavSection["id"];

export const TABS = NAV_SECTIONS.map((s) => s.id);

export const TAB_LABELS = Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, s.label])) as Record<
	Tab,
	string
>;

export const NAV_ITEMS = Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, s.items])) as Record<
	Tab,
	NavItem[]
>;
