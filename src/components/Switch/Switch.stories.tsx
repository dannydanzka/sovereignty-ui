/**
 * Switch Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  tags: ['autodocs'],
  title: 'Components/Switch',
};

export default meta;
type Story = StoryObj<typeof Switch>;

const InteractiveSwitch = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Switch checked={checked} label='Enable notifications' onChange={() => setChecked(!checked)} />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSwitch />,
};

export const On: Story = {
  args: { checked: true, label: 'Active' },
};

export const Off: Story = {
  args: { checked: false, label: 'Inactive' },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: 'Locked (disabled)' },
};

export const NoLabel: Story = {
  args: { checked: true },
};
