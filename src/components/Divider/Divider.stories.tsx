import type { Meta, StoryObj } from '@storybook/react';

import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  argTypes: {
    color: { control: 'color' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    spacing: { control: 'text' },
  },
  component: Divider,
  tags: ['autodocs'],
  title: 'Primitives/Divider',
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [
    (StoryFn) => (
      <div style={{ display: 'flex', height: '100px' }}>
        <span>Left</span>
        <StoryFn />
        <span>Right</span>
      </div>
    ),
  ],
};

export const CustomColor: Story = {
  args: { color: '#FF4081' },
};
