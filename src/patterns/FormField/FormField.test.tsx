import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField label='Email'>
        <input aria-label='Email' placeholder='Enter email' />
      </FormField>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(
      <FormField label='Name' required>
        <input aria-label='Name' />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <FormField error='Required' label='Name'>
        <input aria-label='Name' />
      </FormField>
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows help text when no error', () => {
    render(
      <FormField helpText='Optional' label='Name'>
        <input aria-label='Name' />
      </FormField>
    );
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('error takes priority over help text', () => {
    render(
      <FormField error='Bad' helpText='Optional' label='Name'>
        <input aria-label='Name' />
      </FormField>
    );
    expect(screen.queryByText('Optional')).not.toBeInTheDocument();
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });
});
