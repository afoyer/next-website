import HeroPreview from "@/components/hero-preview";
import AnimatedHeader from "./animated-header";
import LinkCard from "@/components/link-card";
import { NAV_SECTIONS } from "@/lib/nav-links";

const links = NAV_SECTIONS.flatMap(s => s.items);


export default function Home() {
  return (
    <div className="w-full flex flex-col h-dvh overflow-hidden  font-sans sm:px-[10%] pt-8 bg-white/60 dark:bg-background">
      <main className="flex flex-1 min-h-0 w-full flex-col items-center justify-evenly  text-black dark:text-white gap-4 sm:gap-6">
        <div className="pt-10 sm:pt-0">
          {/* <Logo className="sm:h-12 w-auto fill-black dark:fill-white" /> */}
          <AnimatedHeader />
        </div>

        <HeroPreview />
        <div className="sm:hidden grid items-center w-full self-baseline-last overflow-auto">
          <div id="preview-mobile" className="flex flex-col w-full h-full justify-center gap-4 backdrop-blur-lg bg-linear-to-t from-0% from-zinc-300 dark:from-zinc-900 to-50% to-zinc-100/20 dark:to-zinc-700/20 py-4">
            {links.map((link) => (
              <LinkCard key={link.href} href={link.href} label={link.label} preview={link.preview} external={link.external} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
