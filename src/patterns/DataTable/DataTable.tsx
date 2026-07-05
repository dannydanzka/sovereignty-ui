/**
 * DataTable
 *
 * Feature-rich data table with sorting, search, pagination, optional row
 * selection, and optional per-row action buttons.
 * All data operations are controlled externally via callbacks (server-side compatible).
 */

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useCallback } from 'react';

import { ActionButton } from '../../components/ActionButton';
import type { DataTableColumn, DataTableProps, DataTableRowAction } from './DataTable.interfaces';
import { Pagination } from '../Pagination';

import {
  DataTableContainer,
  DataTableFooter,
  DataTableSearchInput,
  DataTableToolbar,
  DataTableWrapper,
  RowActions,
  SelectionCheckbox,
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
  actionsHeader = '',
  className,
  columns,
  currentPage,
  data,
  emptyMessage = 'No data available',
  loading = false,
  onPageChange,
  onSearch,
  onSelectionChange,
  onSort,
  rowActions,
  rowKey,
  searchPlaceholder = 'Search...',
  searchValue,
  selectable = false,
  selectAllLabel = 'Select all rows',
  selectedKeys = [],
  selectRowLabel = 'Select row',
  sort,
  totalPages,
}: DataTableProps<T>) => {
  const hasSelection = selectable && onSelectionChange !== undefined;
  const hasActions = rowActions !== undefined && rowActions.length > 0;
  const totalColumns = columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0);

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

  const handleToggleAll = useCallback(() => {
    if (!onSelectionChange) return;
    const allKeys = data.map(rowKey);
    const allSelected = allKeys.length > 0 && allKeys.every((key) => selectedKeys.includes(key));
    onSelectionChange(allSelected ? [] : allKeys);
  }, [data, onSelectionChange, rowKey, selectedKeys]);

  const handleToggleRowEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { rowKey: key } = e.currentTarget.dataset;
      if (!key || !onSelectionChange) return;
      const isSelected = selectedKeys.includes(key);
      onSelectionChange(
        isSelected ? selectedKeys.filter((selected) => selected !== key) : [...selectedKeys, key]
      );
    },
    [onSelectionChange, selectedKeys]
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

  const handleRowAction = useCallback(
    (action: DataTableRowAction<T>, row: T) => () => action.onClick(row),
    []
  );

  const renderRowActions = (row: T, actions: DataTableRowAction<T>[]) => (
    <RowActions>
      {actions.map((action) => (
        <ActionButton
          disabled={action.disabled?.(row) ?? false}
          icon={action.icon}
          key={action.key}
          title={action.title}
          variant={action.variant ?? 'neutral'}
          onClick={handleRowAction(action, row)}
        />
      ))}
    </RowActions>
  );

  const renderLoadingRows = () =>
    loadingRowKeys.map((key) => (
      <TableRow key={key}>
        {hasSelection && (
          <TableLoadingCell>
            <TableLoadingBar />
          </TableLoadingCell>
        )}
        {columns.map((col) => (
          <TableLoadingCell key={col.key}>
            <TableLoadingBar />
          </TableLoadingCell>
        ))}
        {hasActions && (
          <TableLoadingCell>
            <TableLoadingBar />
          </TableLoadingCell>
        )}
      </TableRow>
    ));

  const renderEmptyRow = () => (
    <TableEmptyRow>
      <TableEmptyCell colSpan={totalColumns}>{emptyMessage}</TableEmptyCell>
    </TableEmptyRow>
  );

  const renderDataRows = () =>
    data.map((row, index) => {
      const key = rowKey(row);
      return (
        <TableRow key={key}>
          {hasSelection && (
            <TableCell $align='center'>
              <SelectionCheckbox
                aria-label={selectRowLabel}
                checked={selectedKeys.includes(key)}
                data-row-key={key}
                type='checkbox'
                onChange={handleToggleRowEvent}
              />
            </TableCell>
          )}
          {columns.map((col) => (
            <TableCell $align={col.align ?? 'left'} key={col.key}>
              {renderCell(col, row, index)}
            </TableCell>
          ))}
          {hasActions && rowActions && (
            <TableCell $align='right'>{renderRowActions(row, rowActions)}</TableCell>
          )}
        </TableRow>
      );
    });

  const allSelected =
    data.length > 0 && data.map(rowKey).every((key) => selectedKeys.includes(key));

  const renderHead = () => (
    <TableHead>
      <TableHeadRow>
        {hasSelection && (
          <TableHeadCell $align='center' $sortable={false} $width='40px'>
            <SelectionCheckbox
              aria-label={selectAllLabel}
              checked={allSelected}
              type='checkbox'
              onChange={handleToggleAll}
            />
          </TableHeadCell>
        )}
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
        {hasActions && (
          <TableHeadCell $align='right' $sortable={false}>
            <TableHeadCellContent>{actionsHeader}</TableHeadCellContent>
          </TableHeadCell>
        )}
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
