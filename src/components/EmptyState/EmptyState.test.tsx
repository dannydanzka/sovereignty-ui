import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState message='Try creating one.' title='No items' />);
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Try creating one.')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState action={<button>Create</button>} title='Empty' />);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState icon={<span data-testid='icon'>I</span>} title='Empty' />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
