// All copy and data for the Pantonify project page.

export type Song = {
	/** Average colour of the cover, hex without the leading #. */
	hex: string;
	artist: string;
	title: string;
	img: string;
	/** Nearest Pantone code and name, as nearest-pantone returns them. */
	pantone: string;
	pantoneName: string;
};

export type ProcessStep = {
	step: string;
	name: string;
	/** Mono "spec" line under the name — a package, endpoint or format. */
	code: string;
	body: string;
	/** Colour of the chip's top block. */
	swatch: string;
};

export type PipelineRow = {
	artist: string;
	title: string;
	/** Stand-in for the album cover (covers load from Spotify at runtime). */
	artGradient: string;
	/** Average colour hex, without the leading #. */
	hex: string;
	pantone: string;
};

export type TimeRange = {
	label: string;
	/** Spotify `time_range` query value. */
	value: "short_term" | "medium_term" | "long_term";
};

export const pantonify = {
	introHeading:
		"Inspired by the clean lines of professional color grading, Pantonify offers a fresh take on personal data visualization.",
	introSubHeading:
		"The project finds a new way to represent people's music with their true colors. The result is a seamless interface that translates top tracks into a vibrant, shareable color story, emphasizing the mood and vibrancy of a user's digital footprint.",

	/** Spec table on the project sheet. */
	meta: {
		role: "Design | Development",
		year: "2020",
		stack: "Next.js · next-auth · Spotify Web API · fast-average-color · nearest-pantone",
		swatch: "1ED760",
		sourceUrl: "https://github.com/afoyer/pantonify",
		sourceLabel: "github.com/afoyer/pantonify",
	},

	result: {
		heading: "Your top tracks, as a swatch book.",
		body: "Each time scale is represented as a separate swatch card, allowing anyone to share their best hues.",
		timeRanges: [
			{ label: "4 weeks", value: "short_term" },
			{ label: "6 months", value: "medium_term" },
			{ label: "All time", value: "long_term" },
		] satisfies TimeRange[],
		endpoint: "GET /v1/me/top/tracks?time_range=",
		callout: {
			label: "Shareable",
			body: "Pantone swatch type card. One tap exports it as an image.",
		},
		/** Labels on the swatch card itself. */
		card: {
			eyebrow: "Top tracks",
			footer: "Made for Aymeric, 31/1/2022",
		},
	},

	process: {
		heading: "Process from Spotify to swatch.",
		body: "Every step is a chip. Read them left to right the way the pipeline runs — auth, data, color, match, render.",
		steps: [
			{
				step: "01",
				name: "Authenticate",
				code: "next-auth · user-top-read",
				body: "Spotify OAuth handled by next-auth. One scope, nothing stored.",
				swatch: "#1ED760",
			},
			{
				step: "02",
				name: "Fetch top tracks",
				code: "/me/top/tracks",
				body: "Three ranges: 4 weeks, 6 months, all time. Each returns art URLs.",
				swatch: "#121212",
			},
			{
				step: "03",
				name: "Sample the art",
				code: "fast-average-color",
				body: "Each cover collapses to one average hex — the mood of the record.",
				swatch: "#4E4546",
			},
			{
				step: "04",
				name: "Match a Pantone",
				code: "nearest-pantone",
				body: "Nearest swatch by color distance. The code replaces the hex.",
				swatch: "#5B4A7A",
			},
			{
				step: "05",
				name: "Compose & share",
				code: "html-to-image",
				body: "Chips stack into the card. Export renders it as a single PNG.",
				swatch: "#FFFFFF",
			},
		] satisfies ProcessStep[],
	},

	pipeline: {
		heading: "One cover. One color.",
		body: "Album colors are averaged out, then matched to their nearest Pantone color.",
		code: [
			"// per track",
			"const { hex } = await fac.getColorAsync(cover);",
			"const swatch = nearestPantone(hex);",
			'// → { code: "19-4013", hex: "2b2f3b" }',
		],
		columns: ["Album art", "Average", "Pantone match"],
		/** Same headers, short enough for the phone grid. */
		columnsShort: ["Art", "Average", "Pantone"],
		/** Rows from a real Pantonify export (31/1/2022). */
		rows: [
			{
				artist: "Daft Punk",
				title: "Random Access Memories",
				artGradient: "linear-gradient(160deg, #3c3f4d 0%, #14161c 60%, #0b0c10 100%)",
				hex: "2B2F3B",
				pantone: "19-4013",
			},
			{
				artist: "Rachel Chinouriri",
				title: "If Only",
				artGradient: "linear-gradient(160deg, #c65a9e 0%, #7a5c9a 55%, #35bcd6 100%)",
				hex: "7A5C9A",
				pantone: "18-3520",
			},
			{
				artist: "Wednesday Campanella",
				title: "The Bamboo Princess",
				artGradient: "linear-gradient(160deg, #d9d7dc 0%, #8c8a93 50%, #5f5c66 100%)",
				hex: "8C8A93",
				pantone: "17-3802",
			},
		] satisfies PipelineRow[],
		footnote:
			"Art tiles are stand-ins for the real covers, which load from Spotify at runtime. Codes are from a real Pantonify export.",
	},

	decisions: {
		heading: "From inspiration to swatch.",
		items: [
			{
				title: "Drop the receipt.",
				body: "Receiptify made the list format famous. A swatch book says something about the music itself, not just the ranking.",
			},
			{
				title: "Art at 25% opacity.",
				body: "The cover sits inside its own swatch, faded, so the color stays the subject and the art becomes a watermark you can still recognise.",
			},
			{
				title: "Code over hex.",
				body: "The first build printed the raw hex. Swapping in the Pantone code made the card read as a real spec sheet — the same trick the login chip plays with 1ED760.",
			},
		],
		mockup: {
			src: "/images/pantonify/mockup.png",
			alt: "Figma mockups: the green login screen and the swatch result screen, desktop and mobile",
			frameLabel: "figma · pantonify mockups",
			caption: "Login and result screens, desktop and mobile",
		},
	},

	cta: {
		heading: "Make yours.",
		sourceLabel: "View source",
		footer: "PANTONIFY© · 1ED760",
	},

	/**
	 * Tracks on the swatch card. Colours and codes are real: the cover's
	 * average colour run through nearest-pantone, the same way the app does it.
	 */
	songs: [
		{
			hex: "252829",
			artist: "DAFT PUNK",
			title: "Give Life Back To Music",
			img: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png",
			pantone: "19-4004",
			pantoneName: "Tap Shoe",
		},
		{
			hex: "4F4648",
			artist: "DUA LIPA",
			title: "Levitating",
			img: "https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
			pantone: "19-3903",
			pantoneName: "Shale",
		},
		{
			hex: "0C181D",
			artist: "THE WEEKND",
			title: "Sacrifice",
			img: "https://upload.wikimedia.org/wikipedia/en/b/b9/The_Weeknd_-_Dawn_FM.png",
			pantone: "19-4013",
			pantoneName: "Dark Navy",
		},
	] satisfies Song[],
} as const;
