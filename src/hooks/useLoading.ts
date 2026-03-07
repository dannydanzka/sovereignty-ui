/**
 * useLoading
 *
 * Loading state management with optional error tracking.
 */

import { useCallback, useState } from 'react';

import type { UseLoadingReturn } from './useLoading.interfaces';

export const useLoading = (initialLoading = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { error, isLoading, setError, startLoading, stopLoading, withLoading };
};
