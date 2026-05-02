'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTransitionStore } from '@/store/transition'

export default function NavigationTrigger() {
  const router = useRouter()
  const pathname = usePathname()
  const phase = useTransitionStore(s => s.phase)
  const pendingHref = useTransitionStore(s => s.pendingHref)
  const clearNavigation = useTransitionStore(s => s.clearNavigation)

  // Snapshot pathname at transition start so we can detect when it changes
  const preNavPathnameRef = useRef(pathname)

  // When canvas fills the screen, fire navigation (or just clear if mobile already navigated)
  useEffect(() => {
    if (phase !== 'navigating' || !pendingHref) return
    if (pathname === pendingHref) {
      // Mobile: push fired at click time, route already loaded — just drop the canvas
      clearNavigation()
    } else {
      preNavPathnameRef.current = pathname
      router.push(pendingHref)
    }
  }, [phase, pendingHref])

  // When pathname changes (new page rendered), drop the canvas cover
  useEffect(() => {
    if (phase === 'navigating' && pathname !== preNavPathnameRef.current) {
      clearNavigation()
    }
  }, [pathname, phase])

  return null
}
