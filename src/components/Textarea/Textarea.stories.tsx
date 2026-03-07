import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  tags: ['autodocs'],
  title: 'Components/Textarea',
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { label: 'Description', placeholder: 'Enter description...' },
};

export const WithCharCount: Story = {
  args: {
    label: 'Bio',
    maxLength: 200,
    placeholder: 'Tell us about yourself...',
    showCount: true,
    value: 'Hello world',
  },
};

export const WithError: Story = {
  args: { error: 'This field is required', label: 'Required field' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled', value: 'Cannot edit this' },
};
