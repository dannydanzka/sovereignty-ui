import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PopButton } from './PopButton';

describe('PopButton', () => {
  it('renders children', () => {
    render(<PopButton>Press</PopButton>);
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<PopButton onClick={handleClick}>Press</PopButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<PopButton disabled>Press</PopButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
