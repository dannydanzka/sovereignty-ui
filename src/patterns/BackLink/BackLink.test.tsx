import { describe, expect, it, vi } from 'vitest';
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
});
