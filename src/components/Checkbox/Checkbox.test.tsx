import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders label', () => {
    render(<Checkbox label='Accept terms' name='terms' />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label='Check' name='check' onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled label='Disabled' name='dis' />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
