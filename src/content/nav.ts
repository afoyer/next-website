import { site } from "@/content/site";

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
//
// This one file drives the desktop navbar, the home-page hero navigator, and
// the mobile pager.
//
// To add a nav item:
//   1. Add an entry to the right section below. `label` and `href` are the
//      only required fields.
//   2. Drop an animated ASCII preview at  public/images/gifs/<slug>-ascii.gif
//      and reference it in `preview`.
//   3. Optionally drop a photo at         public/images/nav2/<slug>.jpg
//      and reference it in `frame`. Without it the home page keeps the
//      default background.
//   4. Create the page at  src/app/(main)<href>/page.tsx
//   5. Run  bun run check:nav  to confirm every internal link has a page.
//
// To add a whole section, add an object to NAV_SECTIONS and add its `id`
// to the `NavSection["id"]` union just below.
// ─────────────────────────────────────────────────────────────────────────────

export type NavItem = {
	/** Text shown in the menu. */
	label: string;
	/** Route ("/about") or full URL for external links. */
	href: string;
	/** Solid colour behind the row on hover. Any CSS colour. */
	gradient: string;
	/** Animated ASCII gif shown in the navbar preview and the page transition. */
	preview?: string;
	/** Raw photo the home-page ASCII background renders on hover. */
	frame?: string;
	/** Opens in a new tab and shows an external-link icon. */
	external?: boolean;
};

export type NavSection = {
	id: "main" | "projects" | "work";
	/** Tab label shown in the menu. */
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
				href: site.socials.linkedin,
				gradient: "#778",
				preview: "/images/gifs/linkedin-ascii.gif",
				frame: "/images/nav2/linkedin.jpg",
				external: true,
			},
			{
				label: "photos",
				href: "/photos",
				gradient: "#4a72a0",
				preview: "/images/gifs/photos-ascii.gif",
				frame: "/images/nav2/photos.jpg",
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
				frame: "/images/nav2/pantonify.jpg",
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
				frame: "/images/nav2/aws.png",
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
