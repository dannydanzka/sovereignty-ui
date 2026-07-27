import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from './Form';

describe('Form', () => {
  it('renders a real form element', () => {
    render(
      <Form aria-label='Nueva cotización'>
        <input aria-label='Cliente' name='cliente' />
      </Form>
    );
    expect(screen.getByRole('form', { name: 'Nueva cotización' })).toBeInTheDocument();
  });

  /* The reason this pattern exists rather than `Stack as="form"`: submit handling. A wrapper that drops
     `onSubmit` looks identical on screen and silently breaks every form in the product. */
  it('submits through the handler it was given', async () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <Form aria-label='Alta' onSubmit={onSubmit}>
        <button type='submit'>Guardar</button>
      </Form>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('forwards the native attributes that make a form a form', () => {
    render(
      <Form aria-label='Alta' id='alta-cliente' noValidate>
        <input aria-label='Nombre' name='nombre' />
      </Form>
    );

    const form = screen.getByRole('form', { name: 'Alta' });
    expect(form).toHaveAttribute('id', 'alta-cliente');
    expect(form).toHaveAttribute('novalidate');
  });
});
