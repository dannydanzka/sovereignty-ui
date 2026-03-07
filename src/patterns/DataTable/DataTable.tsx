/**
 * DataTable
 *
 * Feature-rich data table with sorting, search, and pagination.
 * All data operations are controlled externally via callbacks (server-side compatible).
 */

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useCallback } from 'react';

import type { DataTableColumn, DataTableProps } from './DataTable.interfaces';
import { Pagination } from '../Pagination';

import {
  DataTableContainer,
  DataTableFooter,
  DataTableSearchInput,
  DataTableToolbar,
  DataTableWrapper,
  SortIcon,
  StyledTable,
  TableBody,
  TableCell,
  TableEmptyCell,
  TableEmptyRow,
  TableHead,
  TableHeadCell,
  TableHeadCellContent,
  TableHeadRow,
  TableLoadingBar,
  TableLoadingCell,
  TableRow,
} from './DataTable.styled';

const LOADING_ROWS = 5;
const loadingRowKeys = Array.from({ length: LOADING_ROWS }, (value, index) => {
  void value;
  return `loading-${index}`;
});

export const DataTable = <T,>({
  className,
  columns,
  currentPage,
  data,
  emptyMessage = 'No data available',
  loading = false,
  onPageChange,
  onSearch,
  onSort,
  rowKey,
  searchPlaceholder = 'Search...',
  searchValue,
  sort,
  totalPages,
}: DataTableProps<T>) => {
  const handleSort = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const { colKey } = e.currentTarget.dataset;
      if (!colKey || !onSort) return;

      const column = columns.find((c) => c.key === colKey);
      if (!column?.sortable) return;

      const newDirection = sort?.key === colKey && sort.direction === 'asc' ? 'desc' : 'asc';
      onSort({ direction: newDirection, key: colKey });
    },
    [columns, onSort, sort]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch?.(e.target.value);
    },
    [onSearch]
  );

  const renderSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null;

    const isActive = sort?.key === column.key;

    if (!isActive) {
      return (
        <SortIcon $active={false}>
          <ArrowUpDown size={14} />
        </SortIcon>
      );
    }

    return (
      <SortIcon $active>
        {sort?.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      </SortIcon>
    );
  };

  const renderCell = (column: DataTableColumn<T>, row: T, index: number) => {
    if (column.render) return column.render(row, index);
    return (row as Record<string, unknown>)[column.key] as React.ReactNode;
  };

  const renderLoadingRows = () =>
    loadingRowKeys.map((key) => (
      <TableRow key={key}>
        {columns.map((col) => (
          <TableLoadingCell key={col.key}>
            <TableLoadingBar />
          </TableLoadingCell>
        ))}
      </TableRow>
    ));

  const renderEmptyRow = () => (
    <TableEmptyRow>
      <TableEmptyCell colSpan={columns.length}>{emptyMessage}</TableEmptyCell>
    </TableEmptyRow>
  );

  const renderDataRows = () =>
    data.map((row, index) => (
      <TableRow key={rowKey(row)}>
        {columns.map((col) => (
          <TableCell $align={col.align ?? 'left'} key={col.key}>
            {renderCell(col, row, index)}
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderHead = () => (
    <TableHead>
      <TableHeadRow>
        {columns.map((col) => (
          <TableHeadCell
            $align={col.align ?? 'left'}
            $sortable={Boolean(col.sortable)}
            $width={col.width}
            data-col-key={col.key}
            key={col.key}
            onClick={handleSort}
          >
            <TableHeadCellContent>
              {col.header}
              {renderSortIcon(col)}
            </TableHeadCellContent>
          </TableHeadCell>
        ))}
      </TableHeadRow>
    </TableHead>
  );

  const hasPagination =
    onPageChange !== undefined && currentPage !== undefined && totalPages !== undefined;

  return (
    <DataTableWrapper className={className}>
      {onSearch !== undefined && (
        <DataTableToolbar>
          <DataTableSearchInput
            placeholder={searchPlaceholder}
            type='text'
            value={searchValue ?? ''}
            onChange={handleSearch}
          />
        </DataTableToolbar>
      )}
      <DataTableContainer>
        <StyledTable>
          {renderHead()}
          <TableBody>
            {loading && renderLoadingRows()}
            {!loading && data.length === 0 && renderEmptyRow()}
            {!loading && data.length > 0 && renderDataRows()}
          </TableBody>
        </StyledTable>
      </DataTableContainer>
      {hasPagination && totalPages > 1 && (
        <DataTableFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </DataTableFooter>
      )}
    </DataTableWrapper>
  );
};
