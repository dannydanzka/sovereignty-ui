import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AuthCard, AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders title, subtitle, and children', () => {
    render(
      <AuthLayout subtitle='Sign in to continue' title='Welcome'>
        <AuthCard>
          <form aria-label='login form' />
        </AuthCard>
      </AuthLayout>
    );
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'login form' })).toBeInTheDocument();
  });

  it('renders side slots when provided', () => {
    render(
      <AuthLayout
        leftSlot={<img alt='left illustration' src='/left.svg' />}
        rightSlot={<img alt='right illustration' src='/right.svg' />}
      >
        <span>content</span>
      </AuthLayout>
    );
    expect(screen.getByAltText('left illustration')).toBeInTheDocument();
    expect(screen.getByAltText('right illustration')).toBeInTheDocument();
  });
});
