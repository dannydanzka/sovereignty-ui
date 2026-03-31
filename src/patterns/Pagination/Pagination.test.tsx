import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(screen.queryByLabelText('Pagination')).not.toBeInTheDocument();
  });

  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when page clicked', async () => {
    const handleChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handleChange} />);
    await userEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });
});
