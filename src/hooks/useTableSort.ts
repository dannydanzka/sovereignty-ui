/**
 * useTableSort
 *
 * Sort column and direction state for data tables.
 */

import { useCallback, useState } from 'react';

import type { TableSort, UseTableSortOptions, UseTableSortReturn } from './useTableSort.interfaces';

export const useTableSort = (options: UseTableSortOptions = {}): UseTableSortReturn => {
  const [sort, setSort] = useState<TableSort | null>(
    options.initialKey
      ? { direction: options.initialDirection ?? 'asc', key: options.initialKey }
      : null
  );

  const handleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { direction: 'desc', key } : null;
      }
      return { direction: 'asc', key };
    });
  }, []);

  return { handleSort, sort };
};
