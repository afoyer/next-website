import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  mode: Theme;
  setMode: (mode: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      toggle: () =>
        set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
    }),
    { name: "theme", partialize: (state) => ({ mode: state.mode }) }
  )
);
