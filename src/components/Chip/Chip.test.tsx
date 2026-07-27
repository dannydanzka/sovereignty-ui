import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders the label', () => {
    render(<Chip label='Andamios' value='scaffolding' onSelect={vi.fn()} />);
    expect(screen.getByText('Andamios')).toBeInTheDocument();
  });

  it('hands back the value, not the event — so one handler can serve a whole row', async () => {
    const onSelect = vi.fn();
    render(<Chip label='Andamios' value='scaffolding' onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('scaffolding');
  });

  it('exposes the selection as aria-pressed, so a screen reader hears the filter state', () => {
    const { rerender } = render(<Chip label='Andamios' value='scaffolding' onSelect={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<Chip label='Andamios' selected value='scaffolding' onSelect={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not fire while disabled', async () => {
    const onSelect = vi.fn();
    render(<Chip disabled label='Andamios' value='scaffolding' onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('takes the brand through accent500, so a chip row needs no wrapper to follow the tenant', () => {
    render(<Chip label='Andamios' selected value='scaffolding' onSelect={vi.fn()} />);

    /* jsdom cannot resolve custom properties, so assert the DECLARATION goes through the variable —
       that is what makes `SuiThemeBridge`'s tenant override reach the selected chip. */
    expect(screen.getByRole('button')).toHaveStyle({
      background: 'var(--sui-accent-500, #FF4081)',
    });
  });
});
