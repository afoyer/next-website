'use client'

import { useEffect } from 'react'
import { useTransitionStore } from '@/store/transition'

export default function RouteReadyListener() {
  const initMobile = useTransitionStore(s => s.initMobile)
  useEffect(() => { initMobile() }, [initMobile])
  return null
}
