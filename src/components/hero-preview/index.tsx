'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import HeroNavigator from '@/components/hero-navigator';
import { useTransitionStore } from '@/store/transition';

const DEFAULT_SRC = '/images/gifs/af-ascii.gif';

type Props = { className?: string };

export default function HeroPreview({ className }: Props) {
  const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);
  const phase = useTransitionStore(s => s.phase);
  const registerPreviewEl = useTransitionStore(s => s.registerPreviewEl);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerPreviewEl(previewContainerRef.current);
    return () => registerPreviewEl(null);
  }, [registerPreviewEl]);

  return (
    <motion.div
      className={`hidden sm:flex w-full flex-1 min-h-0${className ? ` ${className}` : ''}`}
      animate={{ opacity: phase === 'idle' ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Navigator: top-aligned, overlaps preview's left edge via negative margin */}
      <div className="self-center shrink-0 relative z-10 mt-6" style={{ marginRight: '-8rem' }}>
        <HeroNavigator onPreview={(src) => setPreviewSrc(src ?? DEFAULT_SRC)} />
      </div>

      {/* Preview container — ref registered with store for TransitionOverlay origin */}
      <div
        ref={previewContainerRef}
        className="flex-1 min-h-0 relative overflow-hidden border-black/80 dark:border-white bg-linear-to-br/oklch from-zinc-300 to-zinc-100 dark:bg-linear-to-br/oklch dark:from-zinc-500 dark:to-slate-900 rounded-[10px]"
      >
        <AnimatePresence>
          <motion.div
            key={previewSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'idle' ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 m-4"
          >
            <Image
              fill
              src={previewSrc}
              alt=""
              className="object-cover opacity-80 rounded-xl invert grayscale-100 dark:grayscale-0 dark:invert-0"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
