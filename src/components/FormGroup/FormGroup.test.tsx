import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FormGroup } from './FormGroup';

describe('FormGroup', () => {
  it('renders children', () => {
    render(
      <FormGroup>
        <input aria-label='Name' placeholder='Name' />
      </FormGroup>
    );
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });
});
