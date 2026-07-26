/**
 * FiltersBar Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { FiltersBar } from './FiltersBar';

const meta: Meta<typeof FiltersBar> = {
  component: FiltersBar,
  tags: ['autodocs'],
  title: 'Patterns/FiltersBar',
};

export default meta;
type Story = StoryObj<typeof FiltersBar>;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'In use', value: 'in_use' },
] as const;

export const SearchAndFilter: Story = {
  render: () => (
    <FiltersBar>
      <FiltersBar.Search placeholder='Search by name or SKU…' value='' onChange={() => {}} />
      <FiltersBar.Select options={STATUS_OPTIONS} value='all' onChange={() => {}} />
    </FiltersBar>
  ),
};
