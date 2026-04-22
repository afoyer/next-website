"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

export function ThemeSync() {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return null;
}
