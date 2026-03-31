import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SortableHeader } from './SortableHeader';

describe('SortableHeader', () => {
  it('renders label', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader label='Name' sortKey='name' onSort={vi.fn()} />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('calls onSort when clicked', async () => {
    const handleSort = vi.fn();
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader label='Name' sortKey='name' onSort={handleSort} />
          </tr>
        </thead>
      </table>
    );
    await userEvent.click(screen.getByText('Name'));
    expect(handleSort).toHaveBeenCalledOnce();
  });
});
