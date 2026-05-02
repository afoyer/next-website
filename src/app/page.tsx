import TransitionLink from "@/components/transition-link";
import HeroPreview from "@/components/hero-preview";
import AnimatedHeader from "./animated-header";
import { ExternalLink } from "lucide-react";
import { Montserrat } from "next/font/google";
import { text } from "stream/consumers";
import Image from "next/image";

const links: { href: string; label: string; external?: boolean; gif: string }[] = [
  { href: "/about", label: "About", gif: "/images/gifs/about-ascii.gif" },
  { href: "/resume", label: "Resume", gif: "/images/gifs/resume-ascii.gif" },
  { href: "/photos", label: "Photos", gif: "/images/gifs/photos-ascii.gif" },
  { href: "https://www.linkedin.com/in/aymeric-foyer", label: "LinkedIn", external: true, gif: "/images/gifs/linkedin-ascii.gif" },
  { href: "/projects/pantonify", label: "Pantonify", gif: "/images/gifs/pantonify-ascii.gif" },
  { href: "/projects/radiosity", label: "Radiosity", gif: "/images/gifs/radiosity-ascii.gif" },
  { href: "/projects/presence", label: "Presence of Light", gif: "/images/gifs/presence-ascii.gif" },
  { href: "/work/amazon", label: "AWS", gif: "/images/gifs/aws-ascii.gif" },
];



const montserrat = Montserrat({ subsets: ['latin'] });


export default function Home() {
  return (
    <div className="w-full flex flex-col h-dvh overflow-hidden  font-sans sm:px-[10%] pt-8 bg-white/60 dark:bg-background">
      <main className="flex flex-1 min-h-0 w-full flex-col items-center justify-evenly  text-black dark:text-white gap-4 sm:gap-6">
        <div className="pt-10 sm:pt-0">
          {/* <Logo className="sm:h-12 w-auto fill-black dark:fill-white" /> */}
          <AnimatedHeader />
        </div>

        <HeroPreview />
        <div className="sm:hidden grid items-center w-full self-baseline-last ">
          <div id="preview-mobile" className=" flex flex-col w-full h-full justify-center gap-4 backdrop-blur-lg bg-linear-to-t from-0% from-zinc-300 dark:from-zinc-900 to-50% to-zinc-100/20 dark:to-zinc-700/20 py-4">
            {links.map((link) => (
              <TransitionLink key={link.href} href={link.href}>
                <div className="overflow-hidden flex-1 relative">
                  <div className="relative z-100 h-full flex flex-row items-center py-6 gap-2 pl-4 bg-linear-to-r from-0% from-zinc-300 dark:from-zinc-900 to-50% to-zinc-100/20 dark:to-zinc-700/20">
                    <p className={montserrat.className + " text-sm text-gradient-to-t from-gray-200 to-gray-50 lowercase font-bold shadow-2xl"}>{link.label} </p>
                    {link.external && <ExternalLink />}
                  </div>
                  {link.gif && <Image src={link.gif} fill alt={`${link.label} preview`} className="sm:hidden absolute z-0 top-0 left-0 h-full w-full rounded-md object-cover invert grayscale dark:invert-0 dark:grayscale-0" unoptimized/>}

                </div>
              </TransitionLink>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
