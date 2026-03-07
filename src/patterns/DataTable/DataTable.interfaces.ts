/**
 * DataTable Component Interfaces
 */

import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  align?: 'center' | 'left' | 'right';
  header: string;
  key: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface DataTableSort {
  direction: SortDirection;
  key: string;
}

export interface DataTableProps<T> {
  className?: string;
  columns: DataTableColumn<T>[];
  currentPage?: number;
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
  onSort?: (sort: DataTableSort) => void;
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchValue?: string;
  sort?: DataTableSort;
  totalPages?: number;
}
