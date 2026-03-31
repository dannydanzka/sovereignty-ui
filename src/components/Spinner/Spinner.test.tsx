import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders spinner', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders text when provided', () => {
    render(<Spinner text='Loading...' />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
