// Single source of truth for the About page copy and lists. Edit here rather
// than in the components.

import type { ReactNode } from "react";

export const ABOUT_BLURB =
	"Focused on software engineering, with a specialization in user interface development. At Amazon Web Services (AWS), I contributed to building a robust end-to-end UI platform using TypeScript and GraphQL Schemas, streamlining data center monitoring and enhancing scalability.  ";

export type Education = {
	id: string;
	school: string;
	degree: string;
	detail?: string;
	years: string;
	logo: { light: string; dark: string };
};

export const EDUCATION: Education[] = [
	{
		id: "cmu",
		school: "Carnegie Mellon University",
		degree: "Master of Human Computer Interaction",
		years: "2026-2027",
		logo: { light: "/images/about/cmu-light.jpg", dark: "/images/about/cmu-dark.jpg" },
	},
	{
		id: "cc",
		school: "Colorado College",
		degree: "Bachelor of Arts in Computer Science",
		detail: "Minor in Japanese Language",
		years: "2016-2020",
		logo: { light: "/images/about/cc-light.png", dark: "/images/about/cc-dark.png" },
	},
];

export type Skill = {
	id: string;
	name: string;
	/** Any renderable icon (lucide, inline svg, <Image>). Takes priority over `iconSrc`. */
	icon?: ReactNode;
	/** Path under /public for a static icon file. */
	iconSrc?: string;
};

// Add icons via `icon` (a React node) or `iconSrc` (a /public path). Skills
// without either render a placeholder glyph.
export const SKILLS: Skill[] = [
	{ id: "react", name: "React" },
	{ id: "nextjs", name: "Next.js" },
	{ id: "figma", name: "Figma" },
	{ id: "typescript", name: "TypeScript" },
	{ id: "gsap", name: "GSAP" },
	{ id: "tailwind", name: "Tailwind" },
	{ id: "graphql", name: "GraphQL" },
	{ id: "aws", name: "AWS" },
	{ id: "threejs", name: "Three.js" },
	{ id: "photography", name: "Photography" },
];

export type CarouselImage = {
	id: string;
	alt: string;
	/** Path under /public. Omit for a placeholder slide. */
	src?: string;
};

export const CAROUSEL_IMAGES: CarouselImage[] = [
	{ id: "1", alt: "Placeholder photo 1" },
	{ id: "2", alt: "Placeholder photo 2" },
	{ id: "3", alt: "Placeholder photo 3" },
];
