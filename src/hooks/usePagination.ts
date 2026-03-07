/**
 * usePagination
 *
 * Page state and navigation handlers for paginated data.
 */

import { useCallback, useMemo, useState } from 'react';

import type { UsePaginationOptions, UsePaginationReturn } from './usePagination.interfaces';

export const usePagination = ({
  initialPage = 1,
  pageSize = 10,
  total,
}: UsePaginationOptions): UsePaginationReturn => {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  const [currentPage, setCurrentPage] = useState(Math.min(initialPage, totalPages));

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const goToNext = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const goToPrev = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
  const goToFirst = useCallback(() => goToPage(1), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

  return {
    currentPage,
    goToFirst,
    goToLast,
    goToNext,
    goToPage,
    goToPrev,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    pageSize,
    totalPages,
  };
};
