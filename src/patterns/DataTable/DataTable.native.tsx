/**
 * DataTable — React Native resolution
 *
 * Web renders an HTML table with sortable headers + pagination; native has no
 * table semantics, so each row renders as a CARD of label/value pairs. Same
 * public props (DataTable.interfaces.ts) and the same controlled callbacks.
 *
 * Covered on native: search (SearchInput), row selection (Checkbox), per-row
 * actions, empty/loading states. Deferred (web-only for now): sortable column
 * headers and the built-in Pagination footer — on native, drive sort/paging with
 * your own controls via the same onSort/onPageChange callbacks.
 */

import { useCallback } from 'react';

import { Checkbox } from '../../components/Checkbox';
import type { DataTableColumn, DataTableProps, DataTableRowAction } from './DataTable.interfaces';
import { SearchInput } from '../../components/SearchInput';

import {
  ActionBtn,
  Card,
  CardActions,
  CardLabel,
  CardRow,
  CardValueBox,
  CardValueText,
  DataTableToolbar,
  DataTableWrapper,
  SelectAllRow,
  StateText,
} from './DataTable.styled';

export const DataTable = <T,>({
  className,
  columns,
  data,
  emptyMessage = 'No data available',
  loading = false,
  onSearch,
  onSelectionChange,
  rowActions,
  rowKey,
  searchPlaceholder = 'Search...',
  searchValue,
  selectable = false,
  selectAllLabel = 'Select all rows',
  selectedKeys = [],
}: DataTableProps<T>) => {
  const hasSelection = selectable && onSelectionChange !== undefined;
  const hasActions = rowActions !== undefined && rowActions.length > 0;

  const handleToggleAll = useCallback(() => {
    if (!onSelectionChange) return;
    const allKeys = data.map(rowKey);
    const allSelected = allKeys.length > 0 && allKeys.every((key) => selectedKeys.includes(key));
    onSelectionChange(allSelected ? [] : allKeys);
  }, [data, onSelectionChange, rowKey, selectedKeys]);

  const handleToggleRow = useCallback(
    (key: string) => () => {
      if (!onSelectionChange) return;
      const isSelected = selectedKeys.includes(key);
      onSelectionChange(
        isSelected ? selectedKeys.filter((selected) => selected !== key) : [...selectedKeys, key]
      );
    },
    [onSelectionChange, selectedKeys]
  );

  const handleRowAction = useCallback(
    (action: DataTableRowAction<T>, row: T) => () => action.onClick(row),
    []
  );

  const renderValue = (column: DataTableColumn<T>, row: T, index: number) => {
    if (column.render) {
      return <CardValueBox>{column.render(row, index)}</CardValueBox>;
    }
    const raw = (row as Record<string, unknown>)[column.key];
    return <CardValueText>{raw === undefined || raw === null ? '' : String(raw)}</CardValueText>;
  };

  const allSelected =
    data.length > 0 && data.map(rowKey).every((key) => selectedKeys.includes(key));

  const renderCard = (row: T, index: number) => {
    const key = rowKey(row);
    return (
      <Card key={key}>
        {hasSelection ? (
          <Checkbox
            checked={selectedKeys.includes(key)}
            name={`select-${key}`}
            onChange={handleToggleRow(key)}
          />
        ) : null}
        {columns.map((col) => (
          <CardRow key={col.key}>
            <CardLabel>{col.header}</CardLabel>
            {renderValue(col, row, index)}
          </CardRow>
        ))}
        {hasActions && rowActions ? (
          <CardActions>
            {rowActions.map((action) => (
              <ActionBtn
                aria-label={action.title}
                disabled={action.disabled?.(row) ?? false}
                key={action.key}
                onClick={handleRowAction(action, row)}
              >
                {action.icon}
              </ActionBtn>
            ))}
          </CardActions>
        ) : null}
      </Card>
    );
  };

  return (
    <DataTableWrapper className={className}>
      {onSearch !== undefined ? (
        <DataTableToolbar>
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue ?? ''}
            onChange={onSearch}
          />
        </DataTableToolbar>
      ) : null}

      {hasSelection ? (
        <SelectAllRow>
          <Checkbox
            checked={allSelected}
            label={selectAllLabel}
            name='select-all'
            onChange={handleToggleAll}
          />
        </SelectAllRow>
      ) : null}

      {loading ? <StateText>Loading…</StateText> : null}
      {!loading && data.length === 0 ? <StateText>{emptyMessage}</StateText> : null}

      {!loading ? data.map((row, index) => renderCard(row, index)) : null}
    </DataTableWrapper>
  );
};
