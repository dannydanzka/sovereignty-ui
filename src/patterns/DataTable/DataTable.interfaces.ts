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

/** Breakpoint below which a column is dropped. Matches the `layout.breakpoint` scale. */
export type DataTableHideBelow = 'lg' | 'md' | 'sm' | 'xl';

export interface DataTableColumn<T> {
  align?: 'center' | 'left' | 'right';
  header: string;
  /**
   * Drop this column below the given breakpoint, instead of letting a wide table squeeze every
   * column into illegibility. The data is still in the row — only this cell stops rendering.
   */
  hideBelow?: DataTableHideBelow;
  key: string;
  /**
   * A floor the browser may not shrink past. `width` is only a *suggestion* to table auto-layout,
   * which is why a wide table used to collapse its identity column to a few characters; this is the
   * prop that actually holds.
   */
  minWidth?: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  /**
   * Pin the column while the table scrolls horizontally, so the row keeps saying which record it is.
   *
   * Two requirements, both load-bearing: a sticky column must declare `minWidth` or `width` **in
   * px** (the left offset of the next sticky column is computed from it — a `%` cannot be summed),
   * and sticky columns must be the LEADING ones. When the table is `selectable` its checkbox column
   * pins too, otherwise the pinned column would slide underneath it.
   */
  sticky?: boolean;
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
