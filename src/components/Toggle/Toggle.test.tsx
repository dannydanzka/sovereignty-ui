import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders label', () => {
    render(<Toggle label='Dark mode' name='dark' />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    render(<Toggle label='Toggle' name='toggle' onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Toggle disabled label='Off' name='off' />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
