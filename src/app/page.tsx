import TransitionLink from "@/components/transition-link";
import HeroPreview from "@/components/hero-preview";
import AnimatedHeader from "./animated-header";

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


export default function Home() {
  return (
    <div className="w-full flex flex-col h-dvh overflow-hidden font-sans px-[10%] py-8 bg-white/60 dark:bg-background">
      <main className="flex flex-1 min-h-0 w-full flex-col items-center text-black dark:text-white gap-4 sm:gap-6">
        <div>
          {/* <Logo className="sm:h-12 w-auto fill-black dark:fill-white" /> */}
          <AnimatedHeader />
          </div>

        <HeroPreview />

        <div id="preview-mobile" className="sm:hidden flex flex-col grow w-full justify-center gap-4">
          {links.map((link) => (
            <TransitionLink key={link.href} href={link.href}>
              <span className="text-sm">{link.label}</span>
            </TransitionLink>
          ))}
        </div>
      </main>
    </div>
  );
}
