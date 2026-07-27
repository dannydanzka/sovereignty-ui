/**
 * TotalsList Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { TotalsList } from './TotalsList';

const meta = {
  argTypes: { align: { control: 'inline-radio', options: ['stretch', 'end'] } },
  component: TotalsList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/TotalsList',
} satisfies Meta<typeof TotalsList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: 'Subtotal', value: '$1,200.00' },
  { label: 'Envío', value: '$150.00' },
  { label: 'IVA', value: '$216.00' },
];

const total = { label: 'Total', value: '$1,566.00' };

export const Default: Story = { args: { items, total } };

export const RightAligned: Story = { args: { align: 'end', items, total } };

export const WithoutTotal: Story = { args: { items } };

/** A branded total: the product sets the variables once, it does not wrap the component. */
export const Branded: Story = {
  args: { items, total },
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--sui-totals-divider': '2px solid #8B0000',
            '--sui-totals-total-color': '#8B0000',
            '--sui-totals-total-size': '1.5rem',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
