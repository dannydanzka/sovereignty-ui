import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PageLayout } from './PageLayout';

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
