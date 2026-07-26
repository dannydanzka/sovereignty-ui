/** useDataTableState interfaces */

import type { DataTableSort } from '../patterns/DataTable';

/** Value a row projects for a given column key. `null` marks the column unsortable. */
export type DataTableSortValue = Date | null | number | string | undefined;

export interface UseDataTableStateOptions<T> {
  data: T[];
  /** Maps a column key to the value that column sorts by. */
  getSortValue?: (row: T, key: string) => DataTableSortValue;
  initialPageSize?: number;
  initialSort?: DataTableSort;
  /** BCP-47 locale for string comparison. Default `'en'`. */
  locale?: string;
}

export interface UseDataTableStateReturn<T> {
  currentPage: number;
  /** Rows after sorting — i.e. what the footer counts. */
  filteredCount: number;
  goToPage: (page: number) => void;
  handleSort: (sort: DataTableSort) => void;
  pageSize: number;
  /** The slice to hand to `DataTable`. */
  paginatedData: T[];
  setPageSize: (size: number) => void;
  sort: DataTableSort | undefined;
  sortedData: T[];
  totalPages: number;
}
