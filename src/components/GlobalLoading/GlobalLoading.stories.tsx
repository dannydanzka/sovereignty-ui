import type { Meta, StoryObj } from '@storybook/react';

import { GlobalLoading } from './GlobalLoading';

const meta: Meta<typeof GlobalLoading> = {
  argTypes: {
    isVisible: { control: 'boolean' },
    text: { control: 'text' },
  },
  component: GlobalLoading,
  tags: ['autodocs'],
  title: 'Primitives/GlobalLoading',
};

export default meta;

type Story = StoryObj<typeof GlobalLoading>;

export const Visible: Story = {
  args: { isVisible: true, text: 'Loading...' },
  decorators: [
    (StoryFn) => (
      <div style={{ height: '300px', position: 'relative' }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const Hidden: Story = {
  args: { isVisible: false },
};

export const CustomContent: Story = {
  args: {
    children: <div style={{ fontSize: '2rem' }}>Custom Loading UI</div>,
    isVisible: true,
  },
  decorators: [
    (StoryFn) => (
      <div style={{ height: '300px', position: 'relative' }}>
        <StoryFn />
      </div>
    ),
  ],
};
