import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const SAMPLE_OPTIONS = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Disabled Option', disabled: true, value: '4' },
];

const meta: Meta<typeof Select> = {
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  component: Select,
  tags: ['autodocs'],
  title: 'Components/Select',
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { label: 'Choose option', options: SAMPLE_OPTIONS, placeholder: 'Select...' },
};

export const WithError: Story = {
  args: {
    error: 'This field is required',
    label: 'Required field',
    options: SAMPLE_OPTIONS,
    placeholder: 'Select...',
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled', options: SAMPLE_OPTIONS, value: '1' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <Select label='Small' options={SAMPLE_OPTIONS} size='sm' />
      <Select label='Medium' options={SAMPLE_OPTIONS} size='md' />
      <Select label='Large' options={SAMPLE_OPTIONS} size='lg' />
    </div>
  ),
};
