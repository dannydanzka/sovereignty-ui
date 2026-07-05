import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { InlineIcon } from './InlineIcon';

describe('InlineIcon', () => {
  it('renders children', () => {
    render(
      <InlineIcon>
        <span data-testid='icon'>I</span>
      </InlineIcon>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('accepts position and tight without breaking rendering', () => {
    render(
      <InlineIcon position='top' tight>
        <span data-testid='stacked'>S</span>
      </InlineIcon>
    );
    expect(screen.getByTestId('stacked')).toBeInTheDocument();
  });
});
