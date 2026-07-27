import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BackLink } from './BackLink';

describe('BackLink', () => {
  it('renders an anchor to the given href', () => {
    render(<BackLink href='/mis-rentas'>← Volver a mis rentas</BackLink>);
    expect(screen.getByRole('link', { name: '← Volver a mis rentas' })).toHaveAttribute(
      'href',
      '/mis-rentas'
    );
  });

  it('works as a button when a router wrapper owns the navigation', async () => {
    const onClick = vi.fn();
    render(<BackLink onClick={onClick}>← Volver</BackLink>);
    await userEvent.click(screen.getByText('← Volver'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  /* The `as` escape hatch is what lets a router-driven product use the pattern instead of wrapping it.
     It worked at runtime but was missing from the props type, so every real consumer failed to compile
     — a test that only rendered the plain anchor could never catch that. This one is typed on purpose. */
  it('renders through a router link component passed as `as`', () => {
    const RouterLink = ({ children, href, ...rest }: { children: ReactNode; href: string }) => (
      <a data-router='yes' href={href} {...rest}>
        {children}
      </a>
    );

    render(
      <BackLink as={RouterLink} href='/cotizaciones'>
        ← Volver a cotizaciones
      </BackLink>
    );

    const link = screen.getByRole('link', { name: '← Volver a cotizaciones' });
    expect(link).toHaveAttribute('data-router', 'yes');
    expect(link).toHaveAttribute('href', '/cotizaciones');
  });
});
