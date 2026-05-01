'use client'

import { useEffect, useRef } from 'react'
import { useTransitionStore } from '@/store/transition'

const CHARS = '!@#$%*+=-~^&?ABCDEFabcdef0123456789'
const CELL = 14      // grid cell size in px
const RING_INNER = 56 // px before frontier where chars start fading in
const RING_OUTER = 28 // px after frontier where chars fade out
const DURATION = 1000 // ms

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function RippleCanvasInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const updateRippleRadius = useTransitionStore(s => s.updateRippleRadius)
  const onRippleComplete = useTransitionStore(s => s.onRippleComplete)
  const initialRadius = useTransitionStore(s => s.rippleRadius)

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
    const maxRadius = initialRadius // screen diagonal — set by store before mounting

    ctx.font = `12px 'Courier New', monospace`

    const startTime = performance.now()
    let rafId: number

    // Pre-generate one random char per cell to avoid per-frame randomness (stable grid)
    const cols = Math.ceil(W / CELL)
    const rows = Math.ceil(H / CELL)
    const cellChars: string[] = Array.from({ length: cols * rows }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    )

    const draw = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / DURATION, 1)
      const currentRadius = maxRadius * (1 - easeInOut(t))

      // Sync with TransitionOverlay mask
      updateRippleRadius(currentRadius)

      ctx.clearRect(0, 0, W, H)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL + CELL / 2
          const y = row * CELL + CELL / 2
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)

          // Only draw in the ring around the frontier
          const distFromFrontier = dist - currentRadius
          if (distFromFrontier < -RING_INNER || distFromFrontier > RING_OUTER) continue

          // Opacity: 1 at frontier, 0 at ring edges
          const opacity = 1 - Math.abs(distFromFrontier) / (distFromFrontier < 0 ? RING_INNER : RING_OUTER)
          const char = cellChars[row * cols + col]

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.fillText(char, x - CELL / 4, y + CELL / 4)
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(draw)
      } else {
        // Final frame: clear and complete
        ctx.clearRect(0, 0, W, H)
        updateRippleRadius(0)
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
