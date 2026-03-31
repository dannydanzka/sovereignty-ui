import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FormActions } from './FormActions';

describe('FormActions', () => {
  it('renders children', () => {
    render(
      <FormActions>
        <button>Save</button>
      </FormActions>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
