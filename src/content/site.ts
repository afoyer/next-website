// src/content/site.ts
//
// Everything about *you* and the site as a whole lives here.
// Change a value, save, and the site updates. No component edits needed.

export const site = {
	/** Shown letter-by-letter on the home page. */
	name: "Aymeric Foyer",
	/** Shown under the name on desktop. */
	tagline: "Front-End Engineer. Designer. Photographer.",
	/** Browser tab title and search-engine description. */
	meta: {
		title: "a.f",
		description: "A personal website",
	},
	/** Small label in the nav bar while on the home page. */
	landingLabel: "/landing-page",
	/** Photo behind the home page when nothing is hovered. */
	defaultHeroImage: "/images/nav2/main.jpg",
	socials: {
		linkedin: "https://www.linkedin.com/in/aymeric-foyer/",
		instagram: "https://www.instagram.com/aymericjlf",
		flickr: "https://www.flickr.com/photos/aymericf/",
	},
} as const;
