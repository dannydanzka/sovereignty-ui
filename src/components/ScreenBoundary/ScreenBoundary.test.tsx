import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ScreenBoundary } from './ScreenBoundary';

describe('ScreenBoundary', () => {
  it('renders children when not loading and no error', () => {
    render(
      <ScreenBoundary isLoading={false} title='Users'>
        <span>User list</span>
      </ScreenBoundary>
    );
    expect(screen.getByText('User list')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('hides children when loading', () => {
    render(
      <ScreenBoundary isLoading title='Users'>
        <span>User list</span>
      </ScreenBoundary>
    );
    expect(screen.queryByText('User list')).not.toBeInTheDocument();
  });

  it('shows error message instead of children', () => {
    render(
      <ScreenBoundary error='Something went wrong' isLoading={false} title='Users'>
        <span>User list</span>
      </ScreenBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('User list')).not.toBeInTheDocument();
  });
});
