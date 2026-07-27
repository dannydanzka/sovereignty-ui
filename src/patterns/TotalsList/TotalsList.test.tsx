import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TotalsList } from './TotalsList';

const items = [
  { label: 'Subtotal', value: '$1,200.00' },
  { label: 'IVA', value: '$192.00' },
];

const total = { label: 'Total', value: '$1,392.00' };

describe('TotalsList', () => {
  it('pairs every line with its value in real dl markup', () => {
    render(<TotalsList items={items} total={total} />);
    // `term` / `definition` are the ARIA roles of dt / dd. Asserting on them proves the pairing is in
    // the markup — the reason this is a dl and not two adjacent spans per line.
    expect(screen.getAllByRole('term')).toHaveLength(3);
    expect(screen.getAllByRole('definition')).toHaveLength(3);
    expect(screen.getByText('$1,392.00')).toBeInTheDocument();
  });

  it('renders without a total, for a summary that has no single answer', () => {
    render(<TotalsList items={items} />);
    expect(screen.queryByTestId('totals-list-total')).not.toBeInTheDocument();
    expect(screen.getAllByRole('term')).toHaveLength(2);
  });

  it('skips hidden lines, so a caller need not build the array conditionally', () => {
    render(<TotalsList items={[...items, { hidden: true, label: 'Descuento', value: '$0.00' }]} />);
    expect(screen.queryByText('Descuento')).not.toBeInTheDocument();
  });

  it('hides the total when the total itself is hidden', () => {
    render(<TotalsList items={items} total={{ ...total, hidden: true }} />);
    expect(screen.queryByTestId('totals-list-total')).not.toBeInTheDocument();
  });

  /* The total is the one line a product will want to brand, so its colour and scale go through
     variables. jsdom does not resolve custom properties, so this asserts the declaration goes THROUGH
     the variable — it fails the moment someone "simplifies" it back to a literal token and closes the
     seam. Whether an ancestor's value wins is verified in a browser. */
  it('declares the total colour and scale through the override variables', () => {
    render(<TotalsList items={items} total={total} />);
    const style = getComputedStyle(screen.getByText('Total'));
    expect(style.color).toContain('--sui-totals-total-color');
    expect(style.fontSize).toContain('--sui-totals-total-size');
  });

  it('hugs the right edge only when asked', () => {
    const { rerender } = render(<TotalsList items={items} />);
    expect(screen.getByTestId('totals-list')).toHaveStyle({ alignSelf: 'stretch' });

    rerender(<TotalsList align='end' items={items} />);
    expect(screen.getByTestId('totals-list')).toHaveStyle({ alignSelf: 'flex-end' });
  });
});
