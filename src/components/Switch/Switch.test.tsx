import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './Switch';

describe('Switch', () => {
  it('renders label', () => {
    render(<Switch label='Notifications' name='notif' />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    render(<Switch label='Toggle' name='toggle' onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled label='Off' name='off' />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
