"use client";

import { useState, useEffect } from "react";
import { getUrl } from "aws-amplify/storage";

type StorageAccessLevel = "guest" | "private" | "protected";

interface UseStorageUrlOptions {
  /** Access level for the file. Defaults to "guest". */
  accessLevel?: StorageAccessLevel;
}

interface UseStorageUrlResult {
  url: string | null;
  isLoading: boolean;
  error: Error | null;
}

interface CacheEntry {
  url: string;
  expiresAt: number;
}

const EXPIRY_SECONDS = 3600;
const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry
const urlCache = new Map<string, CacheEntry>();

function getCached(path: string): string | null {
  const entry = urlCache.get(path);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt - EXPIRY_BUFFER_MS) {
    urlCache.delete(path);
    return null;
  }
  return entry.url;
}

function setCache(path: string, url: string) {
  urlCache.set(path, {
    url,
    expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
  });
}

/**
 * Hook to fetch a presigned URL for a file stored in Amplify Storage.
 * Results are cached in memory so re-mounts skip the network call.
 *
 * @param path - The storage path (e.g. "public/hero.jpg")
 * @param options - Optional access level configuration
 * @returns `{ url, isLoading, error }`
 *
 * @example
 * ```tsx
 * const { url, isLoading } = useStorageUrl("public/images/hero.jpg");
 * ```
 */
export function useStorageUrl(
  path: string | null | undefined,
  options?: UseStorageUrlOptions,
): UseStorageUrlResult {
  const cachedUrl = path ? getCached(path) : null;

  const [result, setResult] = useState<{
    url: string | null;
    error: Error | null;
    resolvedPath: string | null;
  }>(() => {
    if (cachedUrl && path) {
      return { url: cachedUrl, error: null, resolvedPath: path };
    }
    return { url: null, error: null, resolvedPath: null };
  });

  const accessLevel = options?.accessLevel ?? "guest";

  useEffect(() => {
    if (!path || getCached(path)) return;

    let cancelled = false;

    getUrl({
      path,
      options: {
        validateObjectExistence: true,
        expiresIn: EXPIRY_SECONDS,
      },
    })
      .then((res) => {
        if (!cancelled) {
          const url = res.url.toString();
          setCache(path, url);
          setResult({ url, error: null, resolvedPath: path });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            url: null,
            error: err instanceof Error ? err : new Error(String(err)),
            resolvedPath: path,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, accessLevel]);

  if (!path) {
    return { url: null, isLoading: false, error: null };
  }

  const isLoading = result.resolvedPath !== path;

  return {
    url: isLoading ? null : result.url,
    isLoading,
    error: isLoading ? null : result.error,
  };
}
