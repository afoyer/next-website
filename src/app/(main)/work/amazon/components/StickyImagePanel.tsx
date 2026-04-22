'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

export function StickyImagePanel({ src }: { src: string }) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
