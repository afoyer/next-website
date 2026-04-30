'use client';

import { useState } from 'react';
import Image from 'next/image';

const DEFAULT_SRC = '/images/gifs/photos-ascii.gif';
const BLUR_URL = '/af.svg';

type Props = { className?: string };

export default function HeroPreview({ className }: Props) {
  const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);

  return (
    <div
      id="preview-desktop"
      className={`hidden sm:flex flex-1 min-h-0 border-dotted border-2 border-gray-500 rounded-md relative overflow-hidden ${className ?? ''}`}
    >
      <Image
        key={previewSrc}
        fill
        src={previewSrc}
        alt=""
        className="object-cover"
        unoptimized
        placeholder="blur"
        blurDataURL={BLUR_URL}
      />
    </div>
  );
}
