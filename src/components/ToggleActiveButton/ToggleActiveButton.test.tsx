import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ToggleActiveButton } from './ToggleActiveButton';

describe('ToggleActiveButton', () => {
  it('renders with active title by default', () => {
    render(<ToggleActiveButton isActive onClick={vi.fn()} />);
    expect(screen.getByTitle('Desactivar')).toBeInTheDocument();
  });

  it('renders with inactive title', () => {
    render(<ToggleActiveButton isActive={false} onClick={vi.fn()} />);
    expect(screen.getByTitle('Activar')).toBeInTheDocument();
  });

  it('calls onClick when not loading', async () => {
    const handleClick = vi.fn();
    render(<ToggleActiveButton isActive onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    render(<ToggleActiveButton isActive isLoading onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('uses custom title when provided', () => {
    render(<ToggleActiveButton isActive title='Custom' onClick={vi.fn()} />);
    expect(screen.getByTitle('Custom')).toBeInTheDocument();
  });
});
