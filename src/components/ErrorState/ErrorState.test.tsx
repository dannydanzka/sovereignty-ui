import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders title and message', () => {
    render(<ErrorState message='Please retry.' title='Error occurred' />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Please retry.')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<ErrorState action={<button>Retry</button>} title='Error' />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
