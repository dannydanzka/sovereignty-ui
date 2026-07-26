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

  it('calls onBlur when the field loses focus', async () => {
    const handleBlur = vi.fn();
    render(<Input id='sku' label='SKU' name='sku' onBlur={handleBlur} />);
    await userEvent.click(screen.getByLabelText('SKU'));
    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalled();
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

  describe('character counter', () => {
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

  describe('dates and numbers', () => {
    it('renders a date field bounded by min and max', () => {
      render(
        <Input
          id='start'
          label='Inicio'
          max='2026-12-31'
          min='2026-01-01'
          name='startDate'
          type='date'
        />
      );
      const field = screen.getByLabelText('Inicio');
      expect(field).toHaveAttribute('type', 'date');
      expect(field).toHaveAttribute('min', '2026-01-01');
      expect(field).toHaveAttribute('max', '2026-12-31');
    });

    it('renders a number field with its bounds and step', () => {
      render(<Input id='rate' label='Tarifa' min={0} name='dailyRate' step='0.01' type='number' />);
      const field = screen.getByLabelText('Tarifa');
      expect(field).toHaveAttribute('type', 'number');
      expect(field).toHaveAttribute('min', '0');
      expect(field).toHaveAttribute('step', '0.01');
    });

    it('asks for a numeric keyboard without changing the input type', () => {
      render(<Input id='code' inputMode='numeric' label='Código' name='code' />);
      const field = screen.getByLabelText('Código');
      expect(field).toHaveAttribute('inputmode', 'numeric');
      expect(field).toHaveAttribute('type', 'text');
    });
  });
});
