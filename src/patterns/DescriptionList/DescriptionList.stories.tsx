/**
 * DescriptionList Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { DescriptionList } from './DescriptionList';

const meta = {
  argTypes: { columns: { control: 'select', options: ['auto', 1, 2, 3, 4] } },
  component: DescriptionList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/DescriptionList',
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: 'Customer', value: 'María García' },
  { label: 'Status', value: 'Active' },
  { label: 'Start', value: '01 Jul 2026' },
  { label: 'Total', value: '$1,450.00' },
];

export const Default: Story = { args: { items } };

export const FixedColumns: Story = { args: { columns: 2, items } };

export const WithHiddenRow: Story = {
  args: { items: [...items, { hidden: true, label: 'Tax ID', value: '—' }] },
};
