import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders skeleton element', () => {
    render(<Skeleton />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
