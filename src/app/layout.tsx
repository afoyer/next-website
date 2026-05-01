import "./globals.css";

import type { Metadata } from "next";
import AmplifyProvider from "./amplify-provider";
import QueryProvider from "./query-provider";
import Preloader from "@/components/preloader";
import { ReactLenis } from "lenis/react";
import { ThemeSync } from "@/components/theme-sync";
import Navigation from "@/components/nav";
import TransitionOverlay from "@/components/transition-overlay";
import RippleCanvas from "@/components/ripple-canvas";
import RouteReadyListener from "@/components/route-ready-listener";

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
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/utt3wav.css" />
      </head>
      <body className={`font-helvetica antialiased`}>
        <Preloader />
        <TransitionOverlay />
        <RippleCanvas />
        <RouteReadyListener />
        <ThemeSync />
        <div className="z-1000 fixed w-screen top-4 px-4 sm:px-20 sm:pt-6">
          <Navigation />
        </div>
        <AmplifyProvider>
          <QueryProvider>
            <ReactLenis root>{children}</ReactLenis>
          </QueryProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
