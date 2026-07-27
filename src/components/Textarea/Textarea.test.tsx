import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders label', () => {
    render(<Textarea label='Notes' name='notes' />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('calls onChange with value', async () => {
    const handleChange = vi.fn();
    render(<Textarea label='Notes' name='notes' onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText('Notes'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  /* The marker `Input` always had and this component did not: a form that marks one required field
     and not its required neighbour is telling the user the wrong thing about which are mandatory. */
  it('shows the required indicator, and only when required', () => {
    const { rerender } = render(<Textarea label='Notes' name='notes' required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    rerender(<Textarea label='Notes' name='notes' />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea error='Too short' name='notes' />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('shows character count', () => {
    render(<Textarea maxLength={100} name='notes' showCount value='Hello' />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });
});
