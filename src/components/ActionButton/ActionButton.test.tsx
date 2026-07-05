import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders the injected icon with accessible title', () => {
    render(
      <ActionButton icon={<span data-testid='icon'>E</span>} title='Edit row' onClick={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Edit row' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ActionButton icon={<span>E</span>} title='Edit' onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('swaps the icon for a spinner and ignores clicks in loading state', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ActionButton
        icon={<span data-testid='icon'>E</span>}
        isLoading
        title='Edit'
        onClick={onClick}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('respects disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ActionButton disabled icon={<span>E</span>} title='Edit' onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
