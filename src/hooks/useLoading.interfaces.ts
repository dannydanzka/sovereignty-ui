/**
 * useLoading interfaces
 */

export interface UseLoadingReturn {
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}
