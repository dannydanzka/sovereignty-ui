import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Select } from './Select';

const OPTIONS = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
];

describe('Select', () => {
  it('renders label', () => {
    render(<Select label='Country' name='country' options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders options', () => {
    render(<Select name='sel' options={OPTIONS} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders placeholder', () => {
    render(<Select name='sel' options={OPTIONS} placeholder='Choose...' />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const handleChange = vi.fn();
    render(<Select label='Sel' name='sel' options={OPTIONS} onChange={handleChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Sel'), 'b');
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('shows error message', () => {
    render(<Select error='Required' name='sel' options={OPTIONS} />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
