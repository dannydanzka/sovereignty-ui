/**
 * usePagination interfaces
 */

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  total: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  goToFirst: () => void;
  goToLast: () => void;
  goToNext: () => void;
  goToPage: (page: number) => void;
  goToPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  pageSize: number;
  totalPages: number;
}
