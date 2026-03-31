import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { GlobalLoading } from './GlobalLoading';

describe('GlobalLoading', () => {
  it('renders overlay', () => {
    render(<GlobalLoading isVisible />);
    expect(screen.getByTestId('global-loading')).toBeInTheDocument();
  });

  it('renders custom text', () => {
    render(<GlobalLoading isVisible text='Please wait...' />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders custom children instead of spinner', () => {
    render(
      <GlobalLoading isVisible>
        <span>Custom loader</span>
      </GlobalLoading>
    );
    expect(screen.getByText('Custom loader')).toBeInTheDocument();
  });
});
