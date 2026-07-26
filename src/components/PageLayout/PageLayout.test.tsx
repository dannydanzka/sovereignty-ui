import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PageLayout } from './PageLayout';

import { PageTitle, SectionTitle } from './PageLayout.styled';

describe('PageLayout', () => {
  it('renders children', () => {
    render(
      <PageLayout>
        <span>Content</span>
      </PageLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <PageLayout title='Dashboard'>
        <span>Content</span>
      </PageLayout>
    );
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('omits heading when no title', () => {
    render(
      <PageLayout>
        <span>Content</span>
      </PageLayout>
    );
    expect(screen.queryByRole('heading')).toBeNull();
  });
});

describe('title primitives', () => {
  /* The seam that keeps a branded product from forking the heading: recolour/resize by variable, and
     choose the heading LEVEL independently of how big the text looks.

     What this asserts is that the declaration goes THROUGH the variable — not that a var set by an
     ancestor wins. jsdom does not resolve custom properties, so no unit test here can prove the
     cascade; that part is verified in the browser. The assertion still has teeth: it fails the moment
     someone "simplifies" the declaration back to a literal token and closes the seam. */
  it('declares its colour and size through the override variables', () => {
    render(<PageTitle>Cotización</PageTitle>);

    const style = getComputedStyle(screen.getByRole('heading', { name: 'Cotización' }));
    expect(style.color).toContain('--sui-page-title-color');
    expect(style.fontSize).toContain('--sui-page-title-size');
  });

  it('renders the requested heading level, not the one implied by its size', () => {
    render(<PageTitle as='h2'>Detalle</PageTitle>);
    expect(screen.getByRole('heading', { level: 2, name: 'Detalle' })).toBeInTheDocument();
  });

  it('lets a section heading drop to h3 under an h2', () => {
    render(<SectionTitle as='h3'>Partidas</SectionTitle>);
    expect(screen.getByRole('heading', { level: 3, name: 'Partidas' })).toBeInTheDocument();
  });
});
