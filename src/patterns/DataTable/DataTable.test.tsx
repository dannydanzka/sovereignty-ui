import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { DataTable } from './DataTable';
import type { DataTableColumn } from './DataTable.interfaces';

interface User {
  id: number;
  name: string;
}

const COLUMNS: DataTableColumn<User>[] = [
  { header: 'ID', key: 'id' },
  { header: 'Name', key: 'name' },
];

const DATA: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={COLUMNS} data={DATA} rowKey={(r) => String(r.id)} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<DataTable columns={COLUMNS} data={DATA} rowKey={(r) => String(r.id)} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders empty message when no data', () => {
    render(<DataTable columns={COLUMNS} data={[]} rowKey={(r) => String(r.id)} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        emptyMessage='Nothing here'
        rowKey={(r) => String(r.id)}
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders search input when onSearch provided', () => {
    render(
      <DataTable columns={COLUMNS} data={DATA} rowKey={(r) => String(r.id)} onSearch={vi.fn()} />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
