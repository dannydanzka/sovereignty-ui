import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SelectField, TextareaField, TextField } from './FormFields';

describe('TextField', () => {
  it('renders label, help text, and forwards typed value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TextField
        helpText='We never share your email'
        id='email'
        label='Email'
        onChange={onChange}
      />
    );
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByText('We never share your email')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Email/), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows error instead of help text', () => {
    render(<TextField error='Required field' helpText='Hidden help' id='name' label='Name' />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('Hidden help')).not.toBeInTheDocument();
  });
});

describe('SelectField', () => {
  it('renders options and notifies selection', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SelectField
        id='role'
        label='Role'
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
        ]}
        onChange={onChange}
      />
    );
    await user.selectOptions(screen.getByLabelText(/Role/), 'editor');
    expect(onChange).toHaveBeenCalledWith('editor');
  });
});

describe('TextareaField', () => {
  it('renders textarea with label and help text', () => {
    render(<TextareaField helpText='Max 500 chars' id='bio' label='Bio' rows={4} />);
    expect(screen.getByLabelText(/Bio/)).toBeInTheDocument();
    expect(screen.getByText('Max 500 chars')).toBeInTheDocument();
  });
});
