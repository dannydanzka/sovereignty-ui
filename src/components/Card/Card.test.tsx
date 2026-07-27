import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClick when clickable', async () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Click</Card>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is elevated by default and swaps the shadow for a border when outlined', () => {
    const { rerender } = render(<Card>Contenido</Card>);
    const shadowed = getComputedStyle(screen.getByText('Contenido'));
    expect(shadowed.boxShadow).not.toBe('');
    expect(shadowed.borderWidth).toBe('');

    rerender(<Card variant='outlined'>Contenido</Card>);
    // jsdom drops a `border` shorthand whose colour is a var(), so the assertable difference is the
    // shadow: outlined must not float. The border itself is covered visually by the Storybook story.
    const bordered = getComputedStyle(screen.getByText('Contenido'));
    expect(bordered.boxShadow).toBe('');
  });

  it('takes its radius from the shape token, so a consumer can theme the corner', () => {
    render(<Card variant='outlined'>Contenido</Card>);

    /* jsdom cannot resolve custom properties, so assert the DECLARATION goes through the variable.
       This used to be the literal `12px`: same value, but impossible to theme and impossible to
       override without forking the card. */
    expect(screen.getByText('Contenido')).toHaveStyle({
      borderRadius: 'var(--sui-shape-lg, 0.75rem)',
    });
  });

  it('clips content only when asked, so a table can sit flush against the border', () => {
    const { rerender } = render(<Card variant='outlined'>Contenido</Card>);
    expect(screen.getByText('Contenido')).not.toHaveStyle({ overflow: 'hidden' });

    rerender(
      <Card clipped variant='outlined'>
        Contenido
      </Card>
    );
    expect(screen.getByText('Contenido')).toHaveStyle({ overflow: 'hidden' });
  });
});
