import "./globals.css";

import type { Metadata } from "next";
import AmplifyProvider from "./amplify-provider";
import Preloader from "@/components/preloader";
import PageTransition from "@/components/page-transition";
import Nav from "@/components/nav";
import { ReactLenis } from "lenis/react";
import { ThemeSync } from "@/components/theme-sync";
// import Nav2 from "@/components/nav/nav2";

export const metadata: Metadata = {
  title: "a.f",
  description: "A personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/utt3wav.css" />
      </head>
      <body className={`font-helvetica antialiased`}>
        <Preloader />
        <PageTransition />
        <ThemeSync />
        <div className="flex flex-col items-center justify-center">
          <Nav />
          {/* <Navigation /> */}
          {/* <Nav2 /> */}
        </div>
        <AmplifyProvider>
          <ReactLenis root>{children}</ReactLenis>
        </AmplifyProvider>
      </body>
    </html>
  );
}
