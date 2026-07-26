import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './Input';

describe('Input', () => {
  it('renders label', () => {
    render(<Input id='email' label='Email' name='email' />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('calls onChange with value', async () => {
    const handleChange = vi.fn();
    render(<Input id='name' label='Name' name='name' onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('shows error message', () => {
    render(<Input error='Required' id='field' name='field' />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Input id='field' label='Name' name='field' required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<Input id='pass' label='Password' name='pass' type='password' />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByLabelText('Show password'));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled id='field' label='Field' name='field' />);
    expect(screen.getByLabelText('Field')).toBeDisabled();
  });

  it('shows the character count when showCount and maxLength are set', () => {
    render(<Input id='sku' maxLength={100} name='sku' showCount value='Hello' />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('caps the value with the native maxLength', () => {
    render(<Input id='sku' label='SKU' maxLength={10} name='sku' />);
    expect(screen.getByLabelText('SKU')).toHaveAttribute('maxlength', '10');
  });

  it('keeps the counter hidden unless BOTH showCount and maxLength are given', () => {
    const { rerender } = render(<Input id='sku' name='sku' showCount value='Hello' />);
    expect(screen.queryByText(/5\//)).not.toBeInTheDocument();
    rerender(<Input id='sku' maxLength={100} name='sku' value='Hello' />);
    expect(screen.queryByText('5/100')).not.toBeInTheDocument();
  });

  it('renders error and counter together, error first', () => {
    render(
      <Input error='Requerido' id='sku' maxLength={20} name='sku' showCount value='Andamio' />
    );
    expect(screen.getByText('Requerido')).toBeInTheDocument();
    expect(screen.getByText('7/20')).toBeInTheDocument();
  });
});
