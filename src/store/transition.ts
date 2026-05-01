import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'expanding' | 'holding' | 'rippling'

function computeScreenDiagonal(): number {
  return Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
}

interface TransitionStore {
  phase: TransitionPhase
  previewSrc: string | null
  previewRect: DOMRect | null
  rippleRadius: number      // animated 0 → maxRippleRadius, driven by RippleCanvas
  maxRippleRadius: number   // screen diagonal, set when rippling starts
  isMobile: boolean
  _previewEl: HTMLElement | null

  updatePreview(src: string): void
  registerPreviewEl(el: HTMLElement | null): void
  triggerTransition(): void
  onExpandComplete(): void
  onRouteReady(): void
  updateRippleRadius(r: number): void
  onRippleComplete(): void
  initMobile(): void
}

export const useTransitionStore = create<TransitionStore>((set, get) => ({
  phase: 'idle',
  previewSrc: null,
  previewRect: null,
  rippleRadius: 0,
  maxRippleRadius: 0,
  isMobile: false,
  _previewEl: null,

  updatePreview: (src: string) => {
    // Lock preview once a transition starts — no hover hijacking mid-transition
    if (get().phase !== 'idle') return
    set({ previewSrc: src })
  },

  registerPreviewEl: (el: HTMLElement | null) => {
    set({ _previewEl: el })
  },

  triggerTransition: () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const state = get()
    if (state.phase !== 'idle') return

    if (state.isMobile || state._previewEl === null) {
      if (typeof window === 'undefined') return
      set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal() })
      return
    }

    const previewRect = state._previewEl.getBoundingClientRect()
    set({ phase: 'expanding', previewRect })
  },

  onExpandComplete: () => {
    set({ phase: 'holding' })
  },

  onRouteReady: () => {
    if (typeof window === 'undefined') return
    set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal() })
  },

  updateRippleRadius: (r: number) => {
    set({ rippleRadius: r })
  },

  onRippleComplete: () => {
    set({ phase: 'idle', previewSrc: null, previewRect: null, rippleRadius: 0, maxRippleRadius: 0 })
  },

  initMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      set({ isMobile })
    }
  },
}))
