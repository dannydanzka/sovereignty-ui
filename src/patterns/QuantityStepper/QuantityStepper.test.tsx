/**
 * The − n + stepper: values move one click at a time and can never step below one; typing passes
 * through untouched, because the caller's schema is the validator.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QuantityStepper } from './QuantityStepper';

const user = userEvent.setup();

const TEXTS = { decrease: 'Decrease quantity', increase: 'Increase quantity' };

const renderStepper = (value: number, onChange: (next: string) => void) =>
  render(
    <QuantityStepper
      id='qty'
      label='Quantity'
      name='qty'
      texts={TEXTS}
      value={value}
      onChange={onChange}
    />
  );

describe('QuantityStepper', () => {
  it('steps up by one with the + key', async () => {
    const onChange = vi.fn();
    renderStepper(3, onChange);

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));

    expect(onChange).toHaveBeenCalledWith('4');
  });

  it('steps down by one with the − key', async () => {
    const onChange = vi.fn();
    renderStepper(3, onChange);

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));

    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('never steps below one', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('typed input passes through untouched — the caller validates, not the stepper', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);

    await user.type(screen.getByRole('spinbutton'), '2');

    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('keeps an accessible name when the label is visually hidden', () => {
    render(
      <QuantityStepper
        hideLabel
        id='qty'
        label='Quantity'
        name='qty'
        texts={TEXTS}
        value={1}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeInTheDocument();
  });
});
