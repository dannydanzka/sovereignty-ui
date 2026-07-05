/**
 * DataTable Component Interfaces
 */

import type { ReactNode } from 'react';

import type { ActionButtonVariant } from '../../components/ActionButton';

export interface DataTableRowAction<T> {
  disabled?: (row: T) => boolean;
  icon: ReactNode;
  key: string;
  onClick: (row: T) => void;
  title: string;
  variant?: ActionButtonVariant;
}

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
  actionsHeader?: string;
  className?: string;
  columns: DataTableColumn<T>[];
  currentPage?: number;
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
  onSelectionChange?: (selectedKeys: string[]) => void;
  onSort?: (sort: DataTableSort) => void;
  rowActions?: DataTableRowAction<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchValue?: string;
  selectAllLabel?: string;
  selectRowLabel?: string;
  selectable?: boolean;
  selectedKeys?: string[];
  sort?: DataTableSort;
  totalPages?: number;
}
