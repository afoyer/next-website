'use client'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/transition'

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  callback?: () => void
}

export default function TransitionLink({ href, children, className, callback }: TransitionLinkProps) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    const willAnimate = useTransitionStore.getState().triggerTransition(href)
    if (willAnimate) {
      router.prefetch(href)
    } else {
      router.push(href)
    }
    if (callback) callback()
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
