import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  argTypes: {
    height: { control: 'text' },
    variant: { control: 'radio', options: ['text', 'circular', 'rectangular'] },
    width: { control: 'text' },
  },
  component: Skeleton,
  tags: ['autodocs'],
  title: 'Primitives/Skeleton',
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: { variant: 'text' },
};

export const Circular: Story = {
  args: { variant: 'circular' },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular' },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
      <Skeleton height='180px' variant='rectangular' />
      <Skeleton variant='text' width='80%' />
      <Skeleton variant='text' width='60%' />
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <Skeleton height='2.5rem' variant='circular' width='2.5rem' />
        <Skeleton variant='text' width='120px' />
      </div>
    </div>
  ),
};
