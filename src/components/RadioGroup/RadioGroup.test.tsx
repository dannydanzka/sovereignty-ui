import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Radio, RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders radio options', () => {
    render(
      <RadioGroup>
        <Radio label='Option A' name='choice' value='a' />
        <Radio label='Option B' name='choice' value='b' />
      </RadioGroup>
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('calls onChange when radio clicked', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup>
        <Radio label='A' name='choice' value='a' onChange={handleChange} />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('disables radio when disabled', () => {
    render(
      <RadioGroup>
        <Radio disabled label='Disabled' name='choice' value='x' />
      </RadioGroup>
    );
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
