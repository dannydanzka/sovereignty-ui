import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
