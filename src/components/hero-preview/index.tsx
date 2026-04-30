'use client';

import { useState } from 'react';
import Image from 'next/image';

const DEFAULT_SRC = '/images/gifs/photos-ascii.gif';
const SHIMMER_URL = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNlZWUiIG9mZnNldD0iMjAlIiAvPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjZGRkIiBvZmZzZXQ9IjUwJSIgLz4KICAgICAgPHN0b3AtY29sb3I9IiNlZWUiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiNlZWUiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KPC9zdmc+`;

type Props = { className?: string };

export default function HeroPreview({ className }: Props) {
  const [previewSrc, setPreviewSrc] = useState(DEFAULT_SRC);

  return (
    <div
      className={`hidden sm:flex flex-1 min-h-0 border-dotted border-2 border-gray-500 rounded-md relative overflow-hidden${className ? ` ${className}` : ''}`}
    >
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
