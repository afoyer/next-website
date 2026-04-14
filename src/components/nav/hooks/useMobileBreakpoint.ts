"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export function useMobileBreakpoint(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  // useLayoutEffect fires synchronously before paint, so isMobile is correct
  // by the time any useEffect in parent components runs.
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
