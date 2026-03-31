import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders without crashing', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('renders message when provided', () => {
    render(<LoadingState message='Loading data...' />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });
});
