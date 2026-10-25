/**
 * Selection, sort (useTableSort) and paging (usePagination) for the DataTable demo.
 */

import { useMemo, useState } from 'react';

import { usePagination, useTableSort } from '@dannydanzka/sovereignty-ui';

import { DEMO_MEMBERS, DEMO_PAGE_SIZE, SORT_KEY_NAME } from '../../DataTableDemo.constants';
import type { DemoMember } from '../../DataTableDemo.interfaces';

const DESCENDING = 'desc';

export const useDataTableDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { handleSort, sort } = useTableSort({ initialKey: SORT_KEY_NAME });
  const pagination = usePagination({ pageSize: DEMO_PAGE_SIZE, total: DEMO_MEMBERS.length });

  const rows = useMemo(() => {
    const key = (sort?.key ?? SORT_KEY_NAME) as keyof DemoMember;
    const sorted = [...DEMO_MEMBERS].sort((a, b) => a[key].localeCompare(b[key]));
    const ordered = sort?.direction === DESCENDING ? sorted.reverse() : sorted;
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return ordered.slice(start, start + pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize, sort]);

  return { handleSort, pagination, rows, selectedKeys, setSelectedKeys, sort };
};
