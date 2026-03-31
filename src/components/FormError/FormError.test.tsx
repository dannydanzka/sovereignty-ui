import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FormError } from './FormError';

describe('FormError', () => {
  it('renders children', () => {
    render(<FormError>Field is required</FormError>);
    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });
});
