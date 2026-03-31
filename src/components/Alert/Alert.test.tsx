import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children as message', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title='Warning'>Details here</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('has alert role', () => {
    render(<Alert>Msg</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss clicked', async () => {
    const handleDismiss = vi.fn();
    render(<Alert onDismiss={handleDismiss}>Msg</Alert>);
    await userEvent.click(screen.getByLabelText('Dismiss'));
    expect(handleDismiss).toHaveBeenCalledOnce();
  });

  it('does not render dismiss button without onDismiss', () => {
    render(<Alert>Msg</Alert>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });
});
