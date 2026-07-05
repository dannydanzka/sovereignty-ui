import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

describe('DataTable selection and row actions', () => {
  it('reports selected keys when toggling a row and select-all', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey={(r) => String(r.id)}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const rowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    const [firstRow] = rowCheckboxes;
    expect(firstRow).toBeDefined();
    if (firstRow) {
      await user.click(firstRow);
    }
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('renders row actions and fires them with the row', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowActions={[
          { icon: <span>E</span>, key: 'edit', onClick: onEdit, title: 'Edit', variant: 'edit' },
        ]}
        rowKey={(r) => String(r.id)}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    expect(editButtons).toHaveLength(2);
    const [firstEdit] = editButtons;
    if (firstEdit) {
      await user.click(firstEdit);
    }
    expect(onEdit).toHaveBeenCalledWith(DATA[0]);
  });
});
