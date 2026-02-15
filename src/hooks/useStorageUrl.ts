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

/**
 * Hook to fetch a presigned URL for a file stored in Amplify Storage.
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
  options?: UseStorageUrlOptions
): UseStorageUrlResult {
  const [result, setResult] = useState<{
    url: string | null;
    error: Error | null;
    resolvedPath: string | null;
  }>({ url: null, error: null, resolvedPath: null });

  const accessLevel = options?.accessLevel ?? "guest";

  useEffect(() => {
    if (!path) return;

    let cancelled = false;

    getUrl({
      path,
      options: {
        validateObjectExistence: true,
        expiresIn: 3600, // 1 hour
      },
    })
      .then((res) => {
        if (!cancelled) {
          setResult({ url: res.url.toString(), error: null, resolvedPath: path });
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

  // No path — nothing to fetch
  if (!path) {
    return { url: null, isLoading: false, error: null };
  }

  // Derive loading state: still loading if no result matches the current path
  const isLoading = result.resolvedPath !== path;

  return {
    url: isLoading ? null : result.url,
    isLoading,
    error: isLoading ? null : result.error,
  };
}
