/**
 * useTableSort interfaces
 */

export interface TableSort {
  direction: 'asc' | 'desc';
  key: string;
}

export interface UseTableSortOptions {
  initialDirection?: 'asc' | 'desc';
  initialKey?: string;
}

export interface UseTableSortReturn {
  handleSort: (key: string) => void;
  sort: TableSort | null;
}
