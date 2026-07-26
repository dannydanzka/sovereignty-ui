/**
 * TableFooter
 *
 * The footer of a `DataTable`: page size, the visible range, and the paginator. Every control is a
 * shared component (`Select`, `Pagination`) and the footer only lays them out — a list screen should
 * never hand-roll its own page-size dropdown, which is how a paginator ends up looking different
 * from the filter bar directly above it.
 *
 * Wording stays with the caller: `rangeLabel` builds the range sentence, so the pattern carries no
 * language of its own beyond neutral English defaults.
 */

import { useCallback, useMemo } from 'react';

import { Pagination } from '../Pagination';
import { Select } from '../../components/Select';
import type { TableFooterProps } from './TableFooter.interfaces';

import { FooterWrapper, PageSizeGroup, RangeText } from './TableFooter.styled';

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 40, 60, 100] as const;

const defaultRangeLabel = ({
  end,
  filtered,
  start,
}: {
  end: number;
  filtered: number;
  start: number;
  total: number;
}): string => `Showing ${start}–${end} of ${filtered}`;

export const TableFooter = ({
  className,
  currentPage,
  filteredItems,
  onPageChange,
  onPageSizeChange,
  pageSize,
  pageSizeLabel = 'Show',
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  perPageLabel = 'per page',
  rangeLabel = defaultRangeLabel,
  totalItems,
  totalPages,
}: TableFooterProps) => {
  const handlePageSizeChange = useCallback(
    (value: string) => onPageSizeChange(Number(value)),
    [onPageSizeChange]
  );

  const options = useMemo(
    () => pageSizeOptions.map((size) => ({ label: String(size), value: String(size) })),
    [pageSizeOptions]
  );

  if (filteredItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredItems);

  return (
    <FooterWrapper className={className}>
      <PageSizeGroup>
        {pageSizeLabel}
        <Select
          id='table-page-size'
          name='pageSize'
          options={options}
          size='sm'
          value={String(pageSize)}
          onChange={handlePageSizeChange}
        />
        {perPageLabel}
      </PageSizeGroup>

      <RangeText>
        {rangeLabel({ end, filtered: filteredItems, start, total: totalItems })}
      </RangeText>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          showFirstLast
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </FooterWrapper>
  );
};
