import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Divider } from './Divider';

describe('Divider', () => {
  it('renders divider element', () => {
    render(<Divider />);
    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
