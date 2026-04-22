import { create } from "zustand";

interface HeroStore {
  heroLogoVisible: boolean;
  setHeroLogoVisible: (visible: boolean) => void;
}

export const useHeroStore = create<HeroStore>((set) => ({
  heroLogoVisible: false,
  setHeroLogoVisible: (visible) => set({ heroLogoVisible: visible }),
}));
