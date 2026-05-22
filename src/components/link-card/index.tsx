'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import TransitionLink from '@/components/transition-link'
import { useTransitionStore } from '@/store/transition'

const montserrat = Montserrat({ subsets: ['latin'] })

type Props = {
  href: string
  label: string
  preview?: string
  external?: boolean
}

export default function LinkCard({ href, label, preview, external }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const updatePreview = useTransitionStore(s => s.updatePreview)
  const registerPreviewEl = useTransitionStore(s => s.registerPreviewEl)

  const handleMouseEnter = () => {
    if (cardRef.current && preview) {
      registerPreviewEl(cardRef.current)
      updatePreview(preview)
    }
  }

  const inner = (
    <div
      ref={cardRef}
      className="overflow-hidden flex-1 relative"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative z-100 h-full flex flex-row items-center py-6 gap-2 pl-4 bg-linear-to-r from-0% from-zinc-300 dark:from-zinc-900 to-50% to-zinc-100/20 dark:to-zinc-700/20">
        <p className={montserrat.className + ' text-sm text-gradient-to-t from-gray-200 to-gray-50 lowercase font-bold shadow-2xl'}>
          {label}
        </p>
        {external && <ExternalLink size={14} />}
      </div>
      {preview && (
        <div className="absolute z-0 inset-y-0 left-0 w-full portrait:left-1/2 portrait:-translate-x-1/2 portrait:w-[100dvh]">
          <div className="relative w-full h-full">
            <Image
              src={preview}
              fill
              alt={`${label} preview`}
              className="object-cover rounded-md invert grayscale dark:invert-0 dark:grayscale-0"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <TransitionLink href={href}>
      {inner}
    </TransitionLink>
  )
}
