import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AppFooter, FooterLink } from './AppFooter';

describe('AppFooter', () => {
  it('renders brand, columns, copyright, and social slot', () => {
    render(
      <AppFooter
        brandSlot={<strong>ACME</strong>}
        columns={[
          { content: <a href='/about'>About</a>, title: 'Company' },
          { content: <a href='/terms'>Terms</a>, title: 'Legal' },
        ]}
        copyright='© 2026 ACME'
        socialSlot={<a href='https://instagram.com/acme'>Instagram</a>}
      />
    );
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 ACME')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument();
  });

  it('renders a minimal footer with only copyright', () => {
    render(<AppFooter copyright='© 2026 ACME' />);
    expect(screen.getByText('© 2026 ACME')).toBeInTheDocument();
  });
});

describe('FooterLink', () => {
  it('renders a footer anchor, so a product stops re-styling one per link kind', () => {
    render(
      <AppFooter columns={[{ content: <AppFooter.Link href='/terms'>Terms</AppFooter.Link> }]} />
    );
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  });

  it('is reachable as a NAMED export, which is the only form that survives the RSC boundary', () => {
    // A server component gets a client *reference* for AppFooter, and `.Link` on a reference is
    // undefined. Losing this export would break every server-rendered footer.
    expect(FooterLink).toBe(AppFooter.Link);
    render(<AppFooter columns={[{ content: <FooterLink href='/faq'>FAQ</FooterLink> }]} />);
    expect(screen.getByRole('link', { name: 'FAQ' })).toBeInTheDocument();
  });
});
