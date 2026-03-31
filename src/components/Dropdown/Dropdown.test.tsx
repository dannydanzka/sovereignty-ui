import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dropdown } from './Dropdown';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

describe('Dropdown', () => {
  it('renders placeholder', () => {
    render(<Dropdown options={OPTIONS} placeholder='Choose fruit' value='' onChange={vi.fn()} />);
    expect(screen.getByText('Choose fruit')).toBeInTheDocument();
  });

  it('opens menu on click', async () => {
    render(<Dropdown options={OPTIONS} value='' onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('calls onChange when option selected', async () => {
    const handleChange = vi.fn();
    render(<Dropdown options={OPTIONS} value='' onChange={handleChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Banana'));
    expect(handleChange).toHaveBeenCalledWith('banana');
  });

  it('shows selected option label', () => {
    render(<Dropdown options={OPTIONS} value='apple' onChange={vi.fn()} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(<Dropdown disabled options={OPTIONS} value='' onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });
});
