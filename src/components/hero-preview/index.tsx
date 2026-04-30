'use client';

import { useState } from 'react';
import Image from 'next/image';
import HeroNavigator from '@/components/hero-navigator';

const DEFAULT_SRC = '/images/gifs/photos-ascii.gif';
const SHIMMER_URL = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNlZWUiIG9mZnNldD0iMjAlIiAvPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjZGRkIiBvZmZzZXQ9IjUwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI2VlZSIgb2Zmc2V0PSI3MCUiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2VlZSIgLz4KICA8cmVjdCBpZD0iciIgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9InVybCgjZykiIC8+CiAgPGFuaW1hdGUgeGxpbms6aHJlZj0iI3IiIGF0dHJpYnV0ZU5hbWU9IngiIGZyb209Ii03MDAiIHRvPSI3MDAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgo8L3N2Zz4=`;

type Props = { className?: string };

export default function HeroPreview({ className }: Props) {
  const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);

  return (
    <div
      className={`hidden sm:flex flex-1 min-h-0 border-dotted border-2 border-gray-500 rounded-md relative overflow-hidden${className ? ` ${className}` : ''}`}
    >
      <HeroNavigator onPreview={(src) => setPreviewSrc(src ?? DEFAULT_SRC)} />
      <Image
        key={previewSrc}
        fill
        src={previewSrc}
        alt=""
        className="object-cover"
        unoptimized
        placeholder="blur"
        blurDataURL={SHIMMER_URL}
      />
    </div>
  );
}
