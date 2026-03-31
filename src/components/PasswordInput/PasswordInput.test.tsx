import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('renders password input', () => {
    render(<PasswordInput name='pass' placeholder='Enter password' />);
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('toggles visibility when toggle button clicked', async () => {
    const handleToggle = vi.fn();
    render(<PasswordInput name='pass' onToggleVisibility={handleToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleToggle).toHaveBeenCalledOnce();
  });

  it('does not show toggle button without onToggleVisibility', () => {
    render(<PasswordInput name='pass' />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
