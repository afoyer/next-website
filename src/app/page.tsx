import TransitionLink from "@/components/transition-link";
import HeroName from "@/components/hero-name";

export default function Home() {
  return (
    <div className="scrollbar-gutter-stable relative flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-dvh w-full max-w-3xl flex-col items-center justify-between bg-background sm:items-start">
        <div className="w-full h-dvh flex items-center justify-center z-1 pointer-events-none text-2xl font-bold">
          <HeroName />
        </div>
        <TransitionLink href="/about" label="About">
          Go to About
        </TransitionLink>
        <div className="w-full h-dvh flex items-center justify-center"></div>
        <div className="w-full h-dvh flex items-center justify-center"></div>
      </main>
    </div>
  );
}
