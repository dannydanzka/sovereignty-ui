/**
 * Pagination
 *
 * Standalone pagination with page numbers, ellipsis, and prev/next controls.
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

import type { PaginationProps } from './Pagination.interfaces';

import { PaginationButton, PaginationEllipsis, PaginationWrapper } from './Pagination.styled';

const ELLIPSIS = 'ellipsis';

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (value, index) => {
    void value;
    return start + index;
  });
};

const generatePages = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | typeof ELLIPSIS)[] => {
  const totalNumbers = siblingCount * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages <= totalBlocks) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, totalNumbers), ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, ELLIPSIS, ...range(totalPages - totalNumbers + 1, totalPages)];
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, totalPages];
};

export const Pagination = ({
  className,
  currentPage,
  nextLabel,
  onPageChange,
  previousLabel,
  showFirstLast = false,
  siblingCount = 1,
  totalPages,
}: PaginationProps) => {
  const pages = useMemo(
    () => generatePages(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, onPageChange, totalPages]
  );

  const handleFirst = useCallback(() => handlePageChange(1), [handlePageChange]);
  const handlePrev = useCallback(
    () => handlePageChange(currentPage - 1),
    [currentPage, handlePageChange]
  );
  const handleNext = useCallback(
    () => handlePageChange(currentPage + 1),
    [currentPage, handlePageChange]
  );
  const handleLast = useCallback(
    () => handlePageChange(totalPages),
    [handlePageChange, totalPages]
  );

  const handlePageClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const page = Number(e.currentTarget.dataset.page);
      if (!Number.isNaN(page)) handlePageChange(page);
    },
    [handlePageChange]
  );

  const renderPages = () =>
    pages.map((page, index) =>
      page === ELLIPSIS ? (
        <PaginationEllipsis key={`ellipsis-${index}`}>...</PaginationEllipsis>
      ) : (
        <PaginationButton
          $active={page === currentPage}
          aria-current={page === currentPage ? 'page' : undefined}
          data-page={page}
          key={page}
          onClick={handlePageClick}
        >
          {page}
        </PaginationButton>
      )
    );

  if (totalPages <= 1) return null;

  return (
    <PaginationWrapper aria-label='Pagination' className={className}>
      {showFirstLast && (
        <PaginationButton
          aria-label='First page'
          disabled={currentPage === 1}
          onClick={handleFirst}
        >
          <ChevronsLeft size={16} />
        </PaginationButton>
      )}
      <PaginationButton
        aria-label={previousLabel ?? 'Previous page'}
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        <ChevronLeft size={16} />
      </PaginationButton>
      {renderPages()}
      <PaginationButton
        aria-label={nextLabel ?? 'Next page'}
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        <ChevronRight size={16} />
      </PaginationButton>
      {showFirstLast && (
        <PaginationButton
          aria-label='Last page'
          disabled={currentPage === totalPages}
          onClick={handleLast}
        >
          <ChevronsRight size={16} />
        </PaginationButton>
      )}
    </PaginationWrapper>
  );
};
