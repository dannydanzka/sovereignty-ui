/** TableFooter props. */

export interface TableFooterProps {
  className?: string;
  currentPage: number;
  /** Plural entity name used by the filtered-count sentence (e.g. `'orders'`). */
  entityNamePlural?: string;
  /** Rows after filtering — drives the visible range and the paginator. */
  filteredItems: number;
  /** Label before the page-size dropdown. Default `'Show'`. */
  pageSizeLabel?: string;
  /** Label after the page-size dropdown. Default `'per page'`. */
  perPageLabel?: string;
  pageSize: number;
  pageSizeOptions?: readonly number[];
  /** Sentence builder for the visible range, so the caller owns wording and language. */
  rangeLabel?: (range: { end: number; filtered: number; start: number; total: number }) => string;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
