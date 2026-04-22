import TransitionLink from "@/components/transition-link";


import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] })
export default function Home() {
  return (
    <div className="scrollbar-gutter-stable relative flex-col min-h-screen bg-white dark:bg-background font-sans px-[10%] pt-4">
      <main className="flex min-h-dvh w-full max-w-3xl flex-col items-center justify-between sm:items-start text-black dark:text-white">
        <div className={`w-full m-4 flex items-center gap-4 justify-center sm:block z-1 pointer-events-none ${montserrat.className} font-black text-5xl`}>
         <h1>Aymeric</h1>
          <h1>Foyer</h1>
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
