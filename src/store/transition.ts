import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'expanding' | 'rippling' | 'navigating'

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
  visitedPaths: Set<string>
  pendingHref: string | null

  updatePreview(src: string): void
  registerPreviewEl(el: HTMLElement | null): void
  triggerTransition(href: string): boolean  // returns false when animation is skipped
  onExpandComplete(): void
  updateRippleRadius(r: number): void
  onRippleComplete(): void
  clearNavigation(): void
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
  visitedPaths: new Set<string>(),
  pendingHref: null,

  updatePreview: (src: string) => {
    // Lock preview once a transition starts — no hover hijacking mid-transition
    if (get().phase !== 'idle') return
    set({ previewSrc: src })
  },

  registerPreviewEl: (el: HTMLElement | null) => {
    set({ _previewEl: el })
  },

  triggerTransition: (href: string) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false
    }

    const state = get()
    if (state.phase !== 'idle') return false
    if (state.visitedPaths.has(href)) return false

    if (state.isMobile || state._previewEl === null) return false

    const previewRect = state._previewEl.getBoundingClientRect()
    set({ phase: 'expanding', previewRect, pendingHref: href })
    return true
  },

  onExpandComplete: () => {
    if (typeof window === 'undefined') return
    set({ phase: 'rippling', rippleRadius: 0, maxRippleRadius: computeScreenDiagonal() })
  },

  updateRippleRadius: (r: number) => {
    set({ rippleRadius: r })
  },

  onRippleComplete: () => {
    // Keep previewSrc + pendingHref alive so NavigationTrigger can fire + overlay covers the page
    set({ phase: 'navigating', rippleRadius: 0 })
  },

  clearNavigation: () => {
    const { pendingHref, visitedPaths } = get()
    const nextVisited = new Set(visitedPaths)
    if (pendingHref) nextVisited.add(pendingHref)
    set({ phase: 'idle', previewSrc: null, previewRect: null, maxRippleRadius: 0, pendingHref: null, visitedPaths: nextVisited })
  },

  initMobile: () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      set({ isMobile })
    }
  },
}))
