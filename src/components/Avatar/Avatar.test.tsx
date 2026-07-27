import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar name='John Doe' />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name='John' />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders ? when no name', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  /* The two sizes a real product needed and the scale did not have: a 24px chip for a top bar and a
     96px header avatar. Both were hand-rolled copies before they existed here. */
  it.each([
    ['xs', '24px'],
    ['2xl', '96px'],
  ] as const)('supports the %s size (%s)', (size, px) => {
    render(<Avatar name='María García' size={size} />);
    expect(screen.getByTestId('avatar')).toHaveStyle({ height: px, width: px });
  });

  /* Colour goes through variables so a branded product sets it once. jsdom does not resolve custom
     properties, so this asserts the declaration references the variable — it fails if someone
     "simplifies" it back to a literal token and closes the seam. */
  it('declares its colours through the override variables', () => {
    render(<Avatar name='María García' />);
    const style = getComputedStyle(screen.getByTestId('avatar'));
    expect(style.backgroundColor).toContain('--sui-avatar-bg');
    expect(style.color).toContain('--sui-avatar-fg');
  });

  it('renders image when src is provided', () => {
    render(<Avatar alt='User' name='John' src='avatar.jpg' />);
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });
});
