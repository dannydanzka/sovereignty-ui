import type { Meta, StoryObj } from '@storybook/react';

import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
  },
  component: Toggle,
  tags: ['autodocs'],
  title: 'Components/Toggle',
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: { label: 'Notifications' },
};

export const On: Story = {
  args: { checked: true, label: 'Notifications' },
};

export const Small: Story = {
  args: { checked: true, label: 'Compact', size: 'sm' },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: 'Locked' },
};
