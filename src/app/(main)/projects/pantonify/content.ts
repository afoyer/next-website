// All copy and data for the Pantonify project page.

export type Song = {
	/** Hex without the leading #. */
	hex: string;
	artist: string;
	title: string;
	img: string;
};

export const pantonify = {
	introHeading:
		"Inspired by the clean lines of professional color grading, Pantonify offers a fresh take on personal data visualization.",
	introSubHeading:
		"The project pivots away from the popular 'retail receipt' aesthetic to focus on a more abstract, design-centric representation of music. The result is a seamless interface that translates top tracks into a vibrant, shareable color story, emphasizing the mood and vibrancy of a user's digital footprint.",
	/** Album swatches shown on the Pantone-style card. */
	songs: [
		{
			hex: "242525",
			artist: "DAFT PUNK",
			title: "Give Life Back To Music",
			img: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png",
		},
		{
			hex: "4E4546",
			artist: "DUA LIPA",
			title: "Levitating",
			img: "https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
		},
	] satisfies Song[],
} as const;
