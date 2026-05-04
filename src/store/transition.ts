import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'expanding' | 'holding' | 'rippling'

function computeScreenDiagonal(): number {
  return Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
}

export interface TransitionStore {
  phase: TransitionPhase
  previewSrc: string | null
  previewRect: DOMRect | null
  rippleRadius: number
  maxRippleRadius: number
  isMobile: boolean
  _previewEl: HTMLElement | null
  pendingNavigate: (() => void) | null

  updatePreview(src: string): void
  registerPreviewEl(el: HTMLElement | null): void
  triggerTransition(navigateFn?: () => void): void
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
  pendingNavigate: null,

  updatePreview: (src: string) => {
    if (get().phase !== 'idle') return
    set({ previewSrc: src })
  },

  registerPreviewEl: (el: HTMLElement | null) => {
    set({ _previewEl: el })
  },

  triggerTransition: (navigateFn?: () => void) => {
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
      navigateFn?.()
      set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal() })
      return
    }

    const previewRect = state._previewEl.getBoundingClientRect()
    set({ phase: 'expanding', previewRect, pendingNavigate: navigateFn ?? null })
  },

  onExpandComplete: () => {
    if (get().phase !== 'expanding') return
    const { pendingNavigate } = get()
    set({ phase: 'holding', pendingNavigate: null })
    pendingNavigate?.()
  },

  onRouteReady: () => {
    if (typeof window === 'undefined') return
    set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal() })
  },

  updateRippleRadius: (r: number) => {
    set({ rippleRadius: r })
  },

  onRippleComplete: () => {
    set({ phase: 'idle', previewSrc: null, previewRect: null, rippleRadius: 0, maxRippleRadius: 0, pendingNavigate: null })
  },

  initMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      set({ isMobile })
    }
  },
}))
