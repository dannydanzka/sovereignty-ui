import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FiltersBar } from './FiltersBar';

const OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
] as const;

describe('FiltersBar', () => {
  it('reports the typed search term as a value, not an event', async () => {
    const onChange = vi.fn();
    render(
      <FiltersBar>
        <FiltersBar.Search placeholder='Search…' value='' onChange={onChange} />
      </FiltersBar>
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('builds the filter dropdown from options, never from children', async () => {
    const onChange = vi.fn();
    render(
      <FiltersBar>
        <FiltersBar.Select options={OPTIONS} value='all' onChange={onChange} />
      </FiltersBar>
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'active');
    expect(onChange).toHaveBeenCalledWith('active');
  });
});
