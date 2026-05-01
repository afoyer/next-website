'use client'

import { useEffect, useRef } from 'react'
import { useTransitionStore } from '@/store/transition'

const CHARS = '!@#$%*+=-~^&?ABCDEFabcdef0123456789'
const CELL = 14        // grid cell size in px
const RING_BEFORE = 28 // px behind the ring center where chars fade in (toward center)
const RING_AFTER = 56  // px ahead of the ring center where chars fade out (away from center)
const AHEAD_OF_MASK = 30 // chars lead the mask edge by this many px so they're visible against preview
const DURATION = 1000  // ms — matches overlay mask animation

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function RippleCanvasInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const updateRippleRadius = useTransitionStore(s => s.updateRippleRadius)
  const onRippleComplete = useTransitionStore(s => s.onRippleComplete)
  const maxRadius = useTransitionStore(s => s.maxRippleRadius)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const cx = W / 2
    const cy = H / 2

    ctx.font = `12px 'Courier New', monospace`

    const startTime = performance.now()
    let rafId: number

    // Pre-generate one char per cell — stable grid, no per-frame flicker
    const cols = Math.ceil(W / CELL)
    const rows = Math.ceil(H / CELL)
    const cellChars: string[] = Array.from({ length: cols * rows }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    )

    const draw = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / DURATION, 1)
      // Ripple expands outward: 0 → maxRadius
      const currentRadius = maxRadius * easeInOut(t)

      // Sync mask in TransitionOverlay
      updateRippleRadius(currentRadius)

      ctx.clearRect(0, 0, W, H)

      // Ring center leads the mask edge so chars are visible in the still-covered preview area
      const ringCenter = currentRadius + AHEAD_OF_MASK

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL + CELL / 2
          const y = row * CELL + CELL / 2
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)

          const distFromRingCenter = dist - ringCenter
          if (distFromRingCenter < -RING_BEFORE || distFromRingCenter > RING_AFTER) continue

          // Opacity peaks at ring center, fades to 0 at both edges
          const opacity = 1 - Math.abs(distFromRingCenter) / (distFromRingCenter < 0 ? RING_BEFORE : RING_AFTER)
          const char = cellChars[row * cols + col]

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.fillText(char, x - CELL / 4, y + CELL / 4)
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, W, H)
        updateRippleRadius(maxRadius)
        onRippleComplete()
      }
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, []) // run once on mount

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
      }}
      aria-hidden
    />
  )
}

export default function RippleCanvas() {
  const phase = useTransitionStore(s => s.phase)
  if (phase !== 'rippling') return null
  return <RippleCanvasInner />
}
