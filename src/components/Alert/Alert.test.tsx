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

  /* The live-region role follows the variant. `role="alert"` is ASSERTIVE — a screen reader interrupts
     itself — which is right for an error and wrong for a confirmation. This used to be hardcoded to
     `alert` for all four variants, and the previous test asserted exactly that, so it encoded the bug. */
  it.each([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['success', 'status'],
    ['info', 'status'],
  ] as const)('announces %s as role=%s', (variant, role) => {
    render(<Alert variant={variant}>Msg</Alert>);
    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it('lets a consumer override the role when the surrounding UI already announces the change', () => {
    render(
      <Alert role='status' variant='error'>
        Msg
      </Alert>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
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
