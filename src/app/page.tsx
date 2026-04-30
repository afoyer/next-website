import TransitionLink from "@/components/transition-link";
import { Montserrat } from 'next/font/google';
import Logo from "./logo";
import HeroPreview from "@/components/hero-preview";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/photos", label: "Photos" },
  { href: "https://www.linkedin.com/in/aymericfoyer", label: "LinkedIn", external: true },
  { href: "/projects/pantonify", label: "Pantonify" },
  { href: "/projects/radiosity", label: "Radiosity" },
  { href: "/projects/presence", label: "Presence of Light" },
  { href: "/work/amazon", label: "AWS" },
];

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="page w-full relative flex-col min-h-screen bg-white dark:bg-background font-sans px-[10%] pt-4">
      <main className="flex min-h-dvh w-full flex-col items-center text-black dark:text-white gap-4 sm:gap-6">
        <div>
          <Logo className="sm:h-12 w-auto fill-black dark:fill-white" />
          <h1 className={`${montserrat.className} text-xs sm:text-lg font-bold mt-4 tracking-[1.5em]`}>aymeric foyer</h1>
        </div>

        <HeroPreview />

        <div id="preview-mobile" className="sm:hidden flex flex-col grow w-full justify-center gap-4">
          {links.map((link) => (
            <TransitionLink key={link.href} href={link.href} label={link.label}>
              <span className="text-sm">{link.label}</span>
            </TransitionLink>
          ))}
        </div>
      </main>
    </div>
  );
}
