import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    render(<SearchInput value='' onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    render(<SearchInput value='' onChange={handleChange} />);
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('renders children alongside input', () => {
    render(
      <SearchInput value='' onChange={vi.fn()}>
        <button>Filter</button>
      </SearchInput>
    );
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });
});
