/**
 * Pagination Component Interfaces
 */

export interface PaginationProps {
  className?: string;
  currentPage: number;
  nextLabel?: string;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  showFirstLast?: boolean;
  siblingCount?: number;
  totalPages: number;
}
