import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TapHint } from './TapHint';

describe('TapHint', () => {
  it('renders without crashing', () => {
    render(<TapHint />);
    expect(screen.getByTestId('tap-hint')).toBeInTheDocument();
  });
});
