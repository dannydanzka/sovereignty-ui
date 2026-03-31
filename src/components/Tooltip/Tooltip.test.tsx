import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders children and tooltip content', () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
});
