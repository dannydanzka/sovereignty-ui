import { describe, expect, it, vi } from 'vitest';
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

  it('tells the consumer when the mobile panel opens, because the state lives here', async () => {
    const user = userEvent.setup();
    const onMenuToggle = vi.fn();
    render(
      <AppHeader
        logoSlot={<span>ACME</span>}
        mobileMenuContent={<a href='/m'>Mobile</a>}
        onMenuToggle={onMenuToggle}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onMenuToggle).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(onMenuToggle).toHaveBeenLastCalledWith(false);
  });

  it('flips its own colour when transparent, so slot content inherits instead of carrying a flag', () => {
    const { rerender } = render(<AppHeader logoSlot={<span>ACME</span>} />);
    const solid = getComputedStyle(screen.getByTestId('app-header')).color;

    rerender(<AppHeader logoSlot={<span>ACME</span>} transparent />);
    const onDark = getComputedStyle(screen.getByTestId('app-header')).color;

    expect(solid).not.toBe(onDark);
    expect(getComputedStyle(screen.getByTestId('app-header')).background).toContain('transparent');
  });

  it('slides out of view when hidden, and floats over the hero when floating', () => {
    const { rerender } = render(<AppHeader hidden logoSlot={<span>ACME</span>} />);
    expect(screen.getByTestId('app-header')).toHaveStyle({ transform: 'translateY(-100%)' });

    rerender(<AppHeader floating logoSlot={<span>ACME</span>} />);
    expect(screen.getByTestId('app-header')).toHaveStyle({ position: 'fixed' });

    rerender(<AppHeader logoSlot={<span>ACME</span>} />);
    expect(screen.getByTestId('app-header')).toHaveStyle({ position: 'sticky' });
  });

  it('keeps the mobile panel a solid surface under a transparent bar', () => {
    render(
      <AppHeader logoSlot={<span>ACME</span>} mobileMenuContent={<a href='/m'>M</a>} transparent />
    );
    const bar = getComputedStyle(screen.getByTestId('app-header')).color;
    const panel = getComputedStyle(screen.getByTestId('app-header-menu')).color;
    // Text over hero imagery is unreadable — the panel must NOT inherit the on-dark colour.
    expect(panel).not.toBe(bar);
  });
});
