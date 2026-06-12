import { HeroPreview } from "@/components/hero-preview";
import AnimatedHeader from "./animated-header";

export default function Home() {
	return (
		<div className="w-full flex flex-col h-dvh overflow-hidden font-sans sm:px-[10%] pt-8">
			<main className="flex flex-1 min-h-0 w-full flex-col items-center justify-evenly text-black dark:text-white gap-4 sm:gap-6">
				<div className="relative z-10 pt-10 px-[5%] sm:px-8 sm:pt-0 basis-1/10 sm:basis-1/5 w-full flex items-end justify-start gap-3">
					<AnimatedHeader />
				</div>
				<HeroPreview />
			</main>
		</div>
	);
}
