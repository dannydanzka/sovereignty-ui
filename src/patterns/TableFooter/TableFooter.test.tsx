import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TableFooter } from './TableFooter';

const base = {
  currentPage: 1,
  filteredItems: 57,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
  pageSize: 20,
  totalItems: 57,
  totalPages: 3,
};

describe('TableFooter', () => {
  it('reports the visible range of the current page', () => {
    render(<TableFooter {...base} />);
    expect(screen.getByText('Showing 1–20 of 57')).toBeInTheDocument();
  });

  it('clamps the range to the last partial page', () => {
    render(<TableFooter {...base} currentPage={3} />);
    expect(screen.getByText('Showing 41–57 of 57')).toBeInTheDocument();
  });

  it('lets the caller own the wording of the range', () => {
    render(<TableFooter {...base} rangeLabel={({ end, start }) => `${start} a ${end}`} />);
    expect(screen.getByText('1 a 20')).toBeInTheDocument();
  });

  it('reports the chosen page size as a number, not a string', async () => {
    const onPageSizeChange = vi.fn();
    render(<TableFooter {...base} onPageSizeChange={onPageSizeChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), '40');
    expect(onPageSizeChange).toHaveBeenCalledWith(40);
  });

  it('renders nothing when there is nothing to page through', () => {
    const { container } = render(<TableFooter {...base} filteredItems={0} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('hides the paginator on a single page but keeps the range', () => {
    render(<TableFooter {...base} filteredItems={5} totalItems={5} totalPages={1} />);
    expect(screen.getByText('Showing 1–5 of 5')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
