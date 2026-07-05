import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('renders logo, nav, and actions slots', () => {
    render(
      <AppHeader
        actionsSlot={<button type='button'>Sign in</button>}
        logoSlot={<span>ACME</span>}
        navSlot={<a href='/pricing'>Pricing</a>}
      />
    );
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('toggles the mobile menu', async () => {
    const user = userEvent.setup();
    render(
      <AppHeader
        logoSlot={<span>ACME</span>}
        mobileMenuContent={<a href='/mobile'>Mobile link</a>}
      />
    );

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
