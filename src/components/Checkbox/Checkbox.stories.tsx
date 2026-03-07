import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'Components/Checkbox',
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { label: 'Accept terms' },
};

export const Checked: Story = {
  args: { checked: true, label: 'I agree' },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: 'Locked option' },
};

export const NoLabel: Story = {
  args: { checked: false },
};
