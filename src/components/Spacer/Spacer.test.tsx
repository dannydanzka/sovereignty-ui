import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders without children', () => {
    render(<Spacer vertical='md' />);
    expect(screen.getByTestId('spacer')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <Spacer vertical='md'>
        <span>Content</span>
      </Spacer>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
