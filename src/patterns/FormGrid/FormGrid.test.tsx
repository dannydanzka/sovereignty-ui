import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FormGrid } from './FormGrid';

describe('FormGrid', () => {
  it('is two columns by default', () => {
    render(
      <FormGrid>
        <span>campo</span>
      </FormGrid>
    );
    expect(screen.getByTestId('form-grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    });
  });

  it('honours an explicit column count', () => {
    render(
      <FormGrid columns={3}>
        <span>campo</span>
      </FormGrid>
    );
    expect(screen.getByTestId('form-grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('spans the whole row through FormGrid.Full', () => {
    render(
      <FormGrid>
        <FormGrid.Full>
          <span>notas</span>
        </FormGrid.Full>
      </FormGrid>
    );
    expect(screen.getByTestId('form-grid-full')).toHaveStyle({
      gridColumnEnd: '-1',
      gridColumnStart: '1',
    });
  });
});
