import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { DescriptionList } from './DescriptionList';

const items = [
  { label: 'Cliente', value: 'María García' },
  { label: 'Total', value: '$1,450.00' },
];

describe('DescriptionList', () => {
  it('pairs every label with its value in real dl markup', () => {
    render(<DescriptionList items={items} />);
    // `term` / `definition` are the ARIA roles of dt / dd: asserting on them proves the pairing is
    // in the markup, which is the whole reason this is a dl and not two stacked spans.
    expect(screen.getAllByRole('term')).toHaveLength(2);
    expect(screen.getAllByRole('definition')).toHaveLength(2);
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('skips hidden rows, so a caller need not build the array conditionally', () => {
    render(<DescriptionList items={[...items, { hidden: true, label: 'RFC', value: '—' }]} />);
    expect(screen.queryByText('RFC')).not.toBeInTheDocument();
    expect(screen.getAllByRole('term')).toHaveLength(2);
  });

  it('lays out a fixed column count when asked, and auto-fits otherwise', () => {
    const { rerender } = render(<DescriptionList items={items} />);
    expect(screen.getByTestId('description-list')).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    });

    rerender(<DescriptionList columns={3} items={items} />);
    expect(screen.getByTestId('description-list')).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });
});
