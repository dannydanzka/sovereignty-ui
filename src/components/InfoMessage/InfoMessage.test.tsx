import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { InfoMessage } from './InfoMessage';

describe('InfoMessage', () => {
  it('renders children', () => {
    render(<InfoMessage>This is informational.</InfoMessage>);
    expect(screen.getByText('This is informational.')).toBeInTheDocument();
  });
});
