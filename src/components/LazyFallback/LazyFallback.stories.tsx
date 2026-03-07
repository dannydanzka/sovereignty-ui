import type { Meta, StoryObj } from '@storybook/react';

import { LazyFallback } from './LazyFallback';

const meta: Meta<typeof LazyFallback> = {
  component: LazyFallback,
  tags: ['autodocs'],
  title: 'Primitives/LazyFallback',
};

export default meta;

type Story = StoryObj<typeof LazyFallback>;

export const Default: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ height: '300px', position: 'relative' }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const CustomContent: Story = {
  args: {
    children: <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Loading module...</div>,
  },
  decorators: [
    (StoryFn) => (
      <div style={{ height: '300px', position: 'relative' }}>
        <StoryFn />
      </div>
    ),
  ],
};
