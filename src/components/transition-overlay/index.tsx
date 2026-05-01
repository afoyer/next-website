'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useTransitionStore } from '@/store/transition'

export default function TransitionOverlay() {
  const phase = useTransitionStore(s => s.phase)
  const previewSrc = useTransitionStore(s => s.previewSrc)
  const previewRect = useTransitionStore(s => s.previewRect)
  const rippleRadius = useTransitionStore(s => s.rippleRadius)
  const onExpandComplete = useTransitionStore(s => s.onExpandComplete)

  const maskDivRef = useRef<HTMLDivElement>(null)

  // Imperatively update mask each frame during rippling (avoids React re-renders at 60fps)
  useEffect(() => {
    if (!maskDivRef.current || phase !== 'rippling') return
    // Hole expands outward from center as rippleRadius grows 0 → maxRippleRadius
    const mask = `radial-gradient(circle at 50% 50%, transparent ${rippleRadius}px, black ${rippleRadius}px)`
    maskDivRef.current.style.maskImage = mask
    maskDivRef.current.style.webkitMaskImage = mask
  }, [rippleRadius, phase])

  if (phase === 'idle' || !previewSrc) return null

  // Compute target dimensions: viewport-height, aspect-ratio preserved, centered
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900
  const aspectRatio = previewRect ? previewRect.width / previewRect.height : 16 / 9
  const targetH = vh
  const targetW = targetH * aspectRatio
  const targetDims = {
    top: 0,
    left: (vw - targetW) / 2,
    width: targetW,
    height: targetH,
  }

  const initialPos = previewRect
    ? { top: previewRect.top, left: previewRect.left, width: previewRect.width, height: previewRect.height }
    : targetDims

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
      aria-hidden
    >
      <motion.div
        ref={maskDivRef}
        style={{ position: 'absolute', overflow: 'hidden' }}
        initial={initialPos}
        animate={targetDims}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (phase === 'expanding') onExpandComplete()
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          className="rounded-xl invert grayscale-100 dark:grayscale-0 dark:invert-0"
        />
      </motion.div>
    </div>
  )
}
