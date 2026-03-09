/**
 * PasswordInput Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  component: PasswordInput,
  tags: ['autodocs'],
  title: 'Components/PasswordInput',
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

const PasswordInputWithToggle = () => {
  const [show, setShow] = useState(false);
  return (
    <PasswordInput
      placeholder='Enter password'
      showPassword={show}
      value='mySecret123'
      onToggleVisibility={() => setShow(!show)}
    />
  );
};

export const WithToggle: Story = {
  render: () => <PasswordInputWithToggle />,
};

export const Default: Story = {
  args: {
    placeholder: 'Enter password',
    value: '',
  },
};

export const NoPaste: Story = {
  args: {
    disablePaste: true,
    placeholder: 'Paste disabled',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
    value: 'secretPassword',
  },
};
