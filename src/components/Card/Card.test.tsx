import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import styled from 'styled-components';
import userEvent from '@testing-library/user-event';

import { Card } from './Card';

/** A consumer's specialisation of the card — the shape every real call site takes. */
const WrappedCard = styled(Card)`
  display: grid;
`;

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

  it('renders a div by default but takes the element the caller needs', () => {
    const { rerender } = render(<Card>Contenido</Card>);
    expect(screen.getByText('Contenido').tagName).toBe('DIV');

    /* The case that matters: a card inside a `<ul>`. Rendering a div there is invalid markup and a
       screen reader stops announcing the list — which is why consumers hand-rolled a bordered `li`
       instead of adopting the card. */
    rerender(<Card element='li'>Contenido</Card>);
    expect(screen.getByText('Contenido').tagName).toBe('LI');

    rerender(<Card element='article'>Contenido</Card>);
    expect(screen.getByText('Contenido').tagName).toBe('ARTICLE');
  });

  it('still applies its surface when a consumer wraps it in styled(Card)', () => {
    render(
      <WrappedCard element='li' variant='outlined'>
        Contenido
      </WrappedCard>
    );

    /* THE test this component was missing, and the omission was expensive: the polymorphic prop used
       to be called `as`, which styled-components CONSUMES on the wrapper — so `styled(Card)` +
       `as='li'` rendered a bare `li` and Card never ran. Every wrapped card in a consuming product
       lost its border, radius and padding at once, silently, with a green suite. Naming the prop
       `element` is what fixes it; asserting it THROUGH the wrapper is what keeps it fixed. */
    const surface = screen.getByText('Contenido');
    expect(surface.tagName).toBe('LI');
    expect(surface).toHaveStyle({ borderRadius: 'var(--sui-shape-lg, 0.75rem)' });
  });

  it('keeps its surface styles when it changes element', () => {
    render(
      <Card element='li' variant='outlined'>
        Contenido
      </Card>
    );

    /* An `element` that dropped the styling would be worse than no polymorphism at all. */
    expect(screen.getByText('Contenido')).toHaveStyle({
      borderRadius: 'var(--sui-shape-lg, 0.75rem)',
    });
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
