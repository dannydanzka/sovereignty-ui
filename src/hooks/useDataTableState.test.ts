import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTableState } from './useDataTableState';

interface Row {
  name: string;
  qty: number;
}

const ROWS: Row[] = [
  { name: 'Cimbra', qty: 3 },
  { name: 'andamio', qty: 10 },
  { name: 'Puntal', qty: 1 },
];

const getSortValue = (row: Row, key: string) => (key === 'qty' ? row.qty : row.name.toLowerCase());

describe('useDataTableState', () => {
  it('returns only the current page', () => {
    const { result } = renderHook(() =>
      useDataTableState({ data: ROWS, getSortValue, initialPageSize: 2 })
    );
    expect(result.current.paginatedData).toHaveLength(2);
    expect(result.current.totalPages).toBe(2);
  });

  it('sorts numerically, not lexicographically', () => {
    const { result } = renderHook(() => useDataTableState({ data: ROWS, getSortValue }));
    act(() => result.current.handleSort({ direction: 'asc', key: 'qty' }));
    expect(result.current.sortedData.map((r) => r.qty)).toEqual([1, 3, 10]);
  });

  it('sorts strings case-insensitively', () => {
    const { result } = renderHook(() => useDataTableState({ data: ROWS, getSortValue }));
    act(() => result.current.handleSort({ direction: 'asc', key: 'name' }));
    expect(result.current.sortedData[0]?.name).toBe('andamio');
  });

  it('reverses on descending', () => {
    const { result } = renderHook(() => useDataTableState({ data: ROWS, getSortValue }));
    act(() => result.current.handleSort({ direction: 'desc', key: 'qty' }));
    expect(result.current.sortedData[0]?.qty).toBe(10);
  });

  it('returns to the first page when the sort changes', () => {
    const { result } = renderHook(() =>
      useDataTableState({ data: ROWS, getSortValue, initialPageSize: 1 })
    );
    act(() => result.current.goToPage(3));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.handleSort({ direction: 'asc', key: 'qty' }));
    expect(result.current.currentPage).toBe(1);
  });

  it('returns to the first page when the page size changes', () => {
    const { result } = renderHook(() =>
      useDataTableState({ data: ROWS, getSortValue, initialPageSize: 1 })
    );
    act(() => result.current.goToPage(2));
    act(() => result.current.setPageSize(10));
    expect(result.current.currentPage).toBe(1);
  });

  it('clamps the current page when the data shrinks under it', () => {
    const { rerender, result } = renderHook(
      ({ data }) => useDataTableState({ data, getSortValue, initialPageSize: 1 }),
      { initialProps: { data: ROWS } }
    );
    act(() => result.current.goToPage(3));
    rerender({ data: [ROWS[0] as Row] });
    expect(result.current.currentPage).toBe(1);
  });

  it('sorts missing values last regardless of direction', () => {
    const withGap: Row[] = [{ name: 'a', qty: 2 }, { name: 'b' } as Row];
    const { result } = renderHook(() =>
      useDataTableState({
        data: withGap,
        getSortValue: (row, key) => (key === 'qty' ? row.qty : row.name),
      })
    );
    act(() => result.current.handleSort({ direction: 'asc', key: 'qty' }));
    expect(result.current.sortedData[1]?.name).toBe('b');
  });
});
