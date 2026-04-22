"use client";

import { useStorageUrl } from "@/hooks/useStorageUrl";
import Image, { type ImageProps } from "next/image";
import { forwardRef, useState, useCallback } from "react";

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
export const StorageImage = forwardRef<HTMLImageElement, StorageImageProps>(
  function StorageImage(
    { storagePath, fallback, alt, onLoad, ...imageProps },
    ref,
  ) {
    const { url, isLoading, error } = useStorageUrl(storagePath);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImageLoaded(true);
        onLoad?.(e);
      },
      [onLoad],
    );

    if (error || (!isLoading && !url)) {
      return null;
    }

    const showSkeleton = isLoading || !imageLoaded;

    const skeleton = fallback ?? (
      <div
        className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 ${
          imageProps.fill ? "absolute inset-0" : "rounded"
        }`}
        style={
          imageProps.fill
            ? undefined
            : {
                width: imageProps.width ?? "100%",
                height: imageProps.height ?? "100%",
              }
        }
        aria-label="Loading image"
      />
    );

    return (
      <>
        {showSkeleton && skeleton}
        {url && (
          <Image
            ref={ref}
            src={url}
            alt={alt}
            onLoad={handleLoad}
            {...imageProps}
            className={`${imageProps.className ?? ""} ${
              imageLoaded ? "" : "invisible"
            }`}
          />
        )}
      </>
    );
  },
);
