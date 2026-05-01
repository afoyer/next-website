'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionStore } from '@/store/transition'

export function useRouteReady() {
  const pathname = usePathname()
  const phase = useTransitionStore(s => s.phase)
  const onRouteReady = useTransitionStore(s => s.onRouteReady)

  const holdStartRef = useRef<number | null>(null)
  // Pathname recorded when transition starts (expanding), to detect route change
  const transitionPathnameRef = useRef<string>(pathname)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleRouteReady = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const holdStart = holdStartRef.current ?? Date.now()
    const delay = Math.max(0, 1000 - (Date.now() - holdStart))
    timerRef.current = setTimeout(onRouteReady, delay)
  }

  // Track phase transitions
  useEffect(() => {
    if (phase === 'expanding') {
      // Snapshot the current pathname as the "before" state
      transitionPathnameRef.current = pathname
    }
    if (phase === 'holding') {
      holdStartRef.current = Date.now()
      // Fast navigation: route already changed while we were expanding
      if (pathname !== transitionPathnameRef.current) {
        scheduleRouteReady()
      }
    }
    if (phase === 'idle') {
      if (timerRef.current) clearTimeout(timerRef.current)
      holdStartRef.current = null
    }
  }, [phase])

  // Route completed after expand: pathname changes while holding
  useEffect(() => {
    if (phase !== 'holding') return
    if (pathname === transitionPathnameRef.current) return
    scheduleRouteReady()
  }, [pathname])
}
