import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'expanding' | 'holding' | 'rippling'

function computeScreenDiagonal(): number {
  return Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
}

interface TransitionStore {
  phase: TransitionPhase
  previewSrc: string | null
  previewRect: DOMRect | null
  rippleRadius: number
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
  isMobile: false,
  _previewEl: null,

  updatePreview: (src: string) => {
    set({ previewSrc: src })
  },

  registerPreviewEl: (el: HTMLElement | null) => {
    set({ _previewEl: el })
  },

  triggerTransition: () => {
    // Check for prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const state = get()

    // Guard against double-trigger
    if (state.phase !== 'idle') return

    // Mobile or no preview element path: skip expand, go straight to rippling
    if (state.isMobile || state._previewEl === null) {
      if (typeof window === 'undefined') return
      const screenDiagonal = computeScreenDiagonal()
      set({ phase: 'rippling', rippleRadius: screenDiagonal })
      return
    }

    // Desktop path: snapshot preview rect and start expand
    const previewRect = state._previewEl.getBoundingClientRect()
    set({ phase: 'expanding', previewRect })
  },

  onExpandComplete: () => {
    set({ phase: 'holding' })
  },

  onRouteReady: () => {
    if (typeof window === 'undefined') return
    const screenDiagonal = computeScreenDiagonal()
    set({ phase: 'rippling', rippleRadius: screenDiagonal })
  },

  updateRippleRadius: (r: number) => {
    set({ rippleRadius: r })
  },

  onRippleComplete: () => {
    set({ phase: 'idle', previewSrc: null, previewRect: null, rippleRadius: 0 })
  },

  initMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      set({ isMobile })
    }
  },
}))
