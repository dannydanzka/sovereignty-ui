import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EntityCell } from './EntityCell';

describe('EntityCell', () => {
  it('renders name', () => {
    render(<EntityCell name='John Doe' />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders id when provided', () => {
    render(<EntityCell id='USR-001' name='John' />);
    expect(screen.getByText('USR-001')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EntityCell description='Admin user' name='John' />);
    expect(screen.getByText('Admin user')).toBeInTheDocument();
  });
});
