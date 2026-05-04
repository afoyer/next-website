import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'expanding' | 'rippling'

function computeScreenDiagonal(): number {
  return Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
}

interface TransitionStore {
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
    setTimeout(() => {
      if (get().phase !== 'expanding') return
      const { pendingNavigate } = get()
      // Clear pendingNavigate before calling to prevent double-invocation if this fires twice
      set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal(), pendingNavigate: null })
      pendingNavigate?.()
    }, 150)
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
