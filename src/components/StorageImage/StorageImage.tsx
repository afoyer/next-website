"use client";

import { useStorageUrl } from "@/hooks/useStorageUrl";
import Image, { type ImageProps } from "next/image";

type StorageImageProps = Omit<ImageProps, "src"> & {
  /** The Amplify Storage path (e.g. "public/images/hero.jpg") */
  storagePath: string;
  /** Fallback content shown while loading */
  fallback?: React.ReactNode;
};

/**
 * A lazy-loading image component that fetches its source from Amplify Storage.
 *
 * Wraps Next.js `<Image>` so you get all its optimizations (lazy loading,
 * responsive sizing, blur placeholders, etc.) while the `src` is resolved
 * from an Amplify Storage path.
 *
 * @example
 * ```tsx
 * <StorageImage
 *   storagePath="public/images/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={800}
 *   priority // disable lazy load for above-the-fold images
 * />
 * ```
 */
export function StorageImage({
  storagePath,
  fallback,
  alt,
  ...imageProps
}: StorageImageProps) {
  const { url, isLoading, error } = useStorageUrl(storagePath);

  if (isLoading) {
    return (
      fallback ?? (
        <div
          className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded"
          style={{
            width: imageProps.width ?? "100%",
            height: imageProps.height ?? "100%",
          }}
          aria-label="Loading image"
        />
      )
    );
  }

  if (error || !url) {
    return null;
  }

  return <Image src={url} alt={alt} loading="lazy" {...imageProps} />;
}
