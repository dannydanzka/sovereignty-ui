import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LazyFallback } from './LazyFallback';

describe('LazyFallback', () => {
  it('renders fallback container', () => {
    render(<LazyFallback />);
    expect(screen.getByTestId('lazy-fallback')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <LazyFallback>
        <span>Loading brand</span>
      </LazyFallback>
    );
    expect(screen.getByText('Loading brand')).toBeInTheDocument();
  });
});
