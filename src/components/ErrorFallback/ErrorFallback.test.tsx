import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorFallback } from './ErrorFallback';

describe('ErrorFallback', () => {
  it('renders default title and description', () => {
    render(<ErrorFallback />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<ErrorFallback description='Try later' title='Oops' />);
    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Try later')).toBeInTheDocument();
  });

  it('renders retry button and calls onRetry', async () => {
    const handleRetry = vi.fn();
    render(<ErrorFallback onRetry={handleRetry} />);
    await userEvent.click(screen.getByText('Try Again'));
    expect(handleRetry).toHaveBeenCalledOnce();
  });

  it('renders custom actions', () => {
    const actions = [{ label: 'Go Home', onClick: vi.fn() }];
    render(<ErrorFallback actions={actions} />);
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });
});
