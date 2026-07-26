import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders a string title as the library page title', () => {
    render(<PageHeader title='Clientes' />);
    expect(screen.getByRole('heading', { level: 1, name: 'Clientes' })).toBeInTheDocument();
  });

  it('keeps a node title as given, so a product can style its own heading', () => {
    render(<PageHeader title={<h2>Clientes</h2>} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Clientes' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders the description and the actions slot', () => {
    render(
      <PageHeader
        actions={<button type='button'>Nuevo</button>}
        description='8 clientes en total.'
        title='Clientes'
      />
    );
    expect(screen.getByText('8 clientes en total.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument();
  });

  it('omits the description when there is none', () => {
    render(<PageHeader title='Clientes' />);
    expect(screen.getByTestId('page-header').textContent).toBe('Clientes');
  });
});
