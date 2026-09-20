// All copy and data for the TripJam project page. Facts come from the repo
// README (github.com/erenjax/travel-playground).

export type Cursor = {
	name: string;
	color: string;
	/** SVG path (in the hero's 1440×820 coordinate space) the cursor rides on scroll. */
	trail: string;
	/** Keep on phones as well as desktop. */
	mobile?: boolean;
};

export type Feature = {
	id: "collab" | "search" | "voting" | "tools";
	title: string;
	body: string;
};

export const tripjam = {
	name: "TripJam",
	tagline: "Plan the trip together, live. One board, everyone’s cursor on it.",
	event: "CMU Hackathon 2026",
	room: { label: "Tokyo · 4 online" },
	postIt: "Where should we go eat?",
	hotelCard: { kind: "Hotel", name: "Kimpton Shinjuku Tokyo" },

	/** Named cursors in the hero. Colours match Liveblocks presence tags. */
	cursors: [
		{
			name: "Anjali",
			color: "#c89b2c",
			trail: "M-40 160 C 240 60, 420 300, 560 210 S 900 80, 1180 190",
			mobile: true,
		},
		{
			name: "Emily",
			color: "#75457F",
			trail: "M1480 120 C 1200 260, 1020 120, 860 300 S 620 520, 380 470",
			mobile: true,
		},
		{
			name: "Bryan",
			color: "#4c7dd9",
			trail: "M-40 640 C 200 700, 380 520, 620 600 S 1000 720, 1240 610",
			mobile: true,
		},
		{
			name: "Aymeric",
			color: "#000",
			trail: "M1480 700 C 1240 560, 1080 720, 900 640 S 560 700, 240 760",
		},
		{ name: "Quynh", color: "#ff2400", trail: "M200 -40 C 260 200, 120 360, 260 480" },
		{ name: "Effie", color: "#2e9c74", trail: "M1300 860 C 1260 620, 1380 480, 1180 380" },
	] satisfies Cursor[],

	intro: {
		heading: "Multipler Trip Planning.",
		body: "TripJam is a real-time collaborative trip-planning board. Create a trip, share the room code, and search, drag, vote, sketch and chat together — then let Grok turn the board into a day-by-day itinerary you can share or download as a PDF.",
		meta: {
			role: "Developer | Designer",
			team: "with Emily J., Quynh V., Anjali K.",
			sourceUrl: "https://github.com/erenjax/travel-playground",
			sourceLabel: "View source",
		},
	},

	board: {
		heading: "One canvas. Everyone jumps in.",
		body: "Every trip is a Liveblocks room. Cards, votes, notes, drawings, stickers, cursors and chat sync the moment anyone touches them.",
		image: {
			src: "/images/tripjam/board.png",
			alt: "TripJam board for a Tokyo trip: hotel cards with votes and an arrow between them, a post-it, live chat, and the hotels sidebar",
			width: 2054,
			height: 1230,
		},
		/** Callouts positioned as % of the image box. */
		callouts: [
			{ n: 1, label: "Focus tabs & top contenders", x: 2, y: 9 },
			{ n: 2, label: "Cards, votes and arrows", x: 36, y: 42 },
			{ n: 3, label: "Live chat", x: 3, y: 70 },
			{ n: 4, label: "Places sidebar", x: 76, y: 22 },
		],
	},

	features: {
		heading: "Everything the group needs.",
		body: "Search, decide and plan without leaving the board.",
		items: [
			{
				id: "collab",
				title: "Live collaboration",
				body: "Cursors, cards, votes and chat, in sync for everyone in the room.",
			},
			{
				id: "search",
				title: "Place search",
				body: "Google Places for hotels, attractions and food near the destination. Drag a result onto the canvas for others to see.",
			},
			{
				id: "voting",
				title: "Voting & top contenders",
				body: "Up or down on any card. The leaders per category float to the header.",
			},
			{
				id: "tools",
				title: "Whiteboard tools",
				body: "Post-its, drawing, eraser, stickers, and arrows that tell the itinerary which places belong together.",
			},
		] satisfies Feature[],
		itinerary: {
			title: "From board to day-by-day plan.",
			body: "The Itinerary tab sends cards, votes and arrows to Grok, which returns a structured plan. It’s published to the room and downloads as a PDF. Live chat keeps the discussion next to the board.",
			primary: "Create itinerary",
			secondary: "Download PDF",
			days: [
				{
					label: "Day 1 · Oct 2",
					stops: [
						{ time: "09:00", name: "Check in · Kimpton Shinjuku" },
						{ time: "12:30", name: "Ramen · Fuunji" },
						{ time: "15:00", name: "Meiji Jingu" },
					],
				},
				{
					label: "Day 2 · Oct 3",
					stops: [
						{ time: "10:00", name: "teamLab Planets" },
						{ time: "19:00", name: "Omoide Yokocho" },
					],
				},
			],
		},
	},

	process: {
		heading: "Two tracks, one look.",
		body: "Designers worked on how it should look while engineers built the core features. Cursor then reconciled the two — the mockups resolved against what the features actually needed — so the product shipped with one cohesive look.",
		designers: {
			label: "Designers",
			title: "How it looks",
			body: "Figma mockups for the board, cards, chips, sidebar and chat. Warm palette, post-it and card styles.",
		},
		engineers: {
			label: "Engineers",
			title: "What it does",
			body: "Liveblocks rooms and presence, Places search, voting, arrows, the Grok itinerary endpoint.",
		},
		cursor: {
			label: "Resolved in Cursor",
			title: "Mockups, rebuilt on the working features.",
			body: "Feature by feature, we brought the designs into Cursor and reshaped each screen against the real data and interactions, instead of bolting a skin on at the end.",
		},
		result: {
			label: "One product",
			title: "The same card on the board, in search and in the itinerary.",
		},
		beats: [
			{
				title: "Split early.",
				body: "Design explored the look in Figma while engineering stood up rooms, search and voting — no one waited on anyone.",
			},
			{
				title: "Resolve in Cursor.",
				body: "With the features working, the mockups were reshaped against the real data and interactions, screen by screen.",
			},
			{
				title: "Ship one thing.",
				body: "Cards, sidebar, toolbar, chat and itinerary share one system, so the demo felt like a product.",
			},
		],
	},

	hood: {
		heading: "The board is the prompt.",
		body: "Votes rank the places and arrows say which belong together. That structure — not a chat transcript — is what Grok receives, so the plan reflects the group’s actual decisions.",
		steps: [
			{
				label: "Board",
				title: "Cards · votes · arrows",
				body: "Read from the Liveblocks room the moment someone opens the Itinerary tab.",
			},
			{
				label: "/api/itinerary",
				title: "Grok, structured output",
				body: "A Vite plugin keeps the key server-side and caches responses for ten minutes.",
				dark: true,
			},
			{
				label: "Room",
				title: "Published · PDF",
				body: "The itinerary is written back to the room for everyone, and exports as a PDF.",
			},
		],
		stack: [
			"React 19",
			"TypeScript",
			"Vite",
			"Liveblocks · storage + presence",
			"Google Places (New)",
			"xAI Grok 4.6",
			"motion",
			"react-router",
		],
	},

	cta: {
		heading: "Plan the next one together.",
		sourceLabel: "View source",
		footer: "TripJam · CMU Hackathon 2026",
	},
} as const;
