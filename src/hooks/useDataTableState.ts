/**
 * useDataTableState
 *
 * Sort + pagination state for an in-memory list, returning the slice to render. `useTableSort` and
 * `usePagination` each solve half of this; every list screen then re-wires the same two halves
 * together (and re-derives "reset to page 1 when the sort or the page size changes"). This composes
 * them once.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { DataTableSort } from '../patterns/DataTable';
import type {
  DataTableSortValue,
  UseDataTableStateOptions,
  UseDataTableStateReturn,
} from './useDataTableState.interfaces';

const FIRST_PAGE = 1;

const compareValues = (a: DataTableSortValue, b: DataTableSortValue, locale: string): number => {
  const aMissing = a === null || a === undefined;
  const bMissing = b === null || b === undefined;
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), locale, { sensitivity: 'base' });
};

export const useDataTableState = <T>({
  data,
  getSortValue,
  initialPageSize = 20,
  initialSort,
  locale = 'en',
}: UseDataTableStateOptions<T>): UseDataTableStateReturn<T> => {
  const [sort, setSort] = useState<DataTableSort | undefined>(initialSort);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);

  const sortedData = useMemo(() => {
    if (!sort || !getSortValue) return data;
    return [...data].sort((rowA, rowB) => {
      const comparison = compareValues(
        getSortValue(rowA, sort.key),
        getSortValue(rowB, sort.key),
        locale
      );
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort, getSortValue, locale]);

  const totalPages = Math.max(FIRST_PAGE, Math.ceil(sortedData.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - FIRST_PAGE) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = useCallback((next: DataTableSort) => {
    setSort(next);
    setCurrentPage(FIRST_PAGE);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(FIRST_PAGE);
  }, []);

  return {
    currentPage,
    filteredCount: sortedData.length,
    goToPage: setCurrentPage,
    handleSort,
    pageSize,
    paginatedData,
    setPageSize,
    sort,
    sortedData,
    totalPages,
  };
};
