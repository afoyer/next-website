import HeroPreview from "@/components/hero-preview";
import LinkCard from "@/components/link-card";
import { NAV_SECTIONS } from "@/lib/nav-links";
import AnimatedHeader from "./animated-header";
import Logo from "./logo";

const links = NAV_SECTIONS.flatMap((s) => s.items);

export default function Home() {
	return (
		<div className="w-full flex flex-col h-dvh overflow-hidden  font-sans sm:px-[10%] pt-8 bg-white/90 dark:bg-background">
			<main className="flex flex-1 min-h-0 w-full flex-col items-center justify-evenly  text-black dark:text-white gap-4 sm:gap-6">
				<div className="pt-10 px-[5%] sm:px-8 sm:pt-0 basis-1/10 sm:basis-1/5 w-full flex items-end justify-start gap-3">
					<AnimatedHeader />
				</div>

				<HeroPreview />
				<div className="sm:hidden grid items-center w-full self-baseline-last overflow-auto">
					<div id="preview-mobile" className="flex flex-col w-full h-dvh justify-center gap-4 p-4">
						{links.map((link) => (
							<LinkCard
								key={link.href}
								href={link.href}
								label={link.label}
								preview={link.preview}
								external={link.external}
							/>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
