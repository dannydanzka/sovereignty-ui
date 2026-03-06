/**
 * StatsCard Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { StatsCard } from './StatsCard';

const meta = {
  argTypes: {
    variant: { control: 'radio', options: ['default', 'primary', 'success', 'warning'] },
  },
  component: StatsCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/StatsCard',
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { label: 'Label', value: 42 },
  render: () => (
    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(2, 200px)' }}>
      <StatsCard label='Default' value={42} />
      <StatsCard label='Primary' value='15 km' variant='primary' />
      <StatsCard label='Success' sublabel='of 10 challenges' value={8} variant='success' />
      <StatsCard label='Warning' sublabel='days remaining' value={3} variant='warning' />
    </div>
  ),
};

export const Default: Story = {
  args: { label: 'Challenges completed', value: 5 },
};

export const WithSublabel: Story = {
  args: { label: 'Distance', sublabel: 'total km', value: '42.5', variant: 'primary' },
};
