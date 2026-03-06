/**
 * Input Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
  title: 'Components/Input',
};

export default meta;
type Story = StoryObj<typeof Input>;

export const AllVariants: Story = {
  args: { id: 'demo', name: 'demo' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input id='text' label='Text input' name='text' placeholder='Enter text...' />
      <Input id='email' label='Email' name='email' placeholder='email@example.com' type='email' />
      <Input
        id='password'
        label='Password'
        name='password'
        placeholder='Enter password...'
        type='password'
      />
      <Input error='This field is required.' id='error' label='With error' name='error' />
      <Input disabled id='disabled' label='Disabled' name='disabled' value='Cannot edit' />
    </div>
  ),
};

export const Default: Story = {
  args: { id: 'text', label: 'Label', name: 'text', placeholder: 'Enter text...' },
};

export const Password: Story = {
  args: {
    id: 'password',
    label: 'Password',
    name: 'password',
    placeholder: 'Enter password...',
    type: 'password',
  },
};

export const WithError: Story = {
  args: {
    error: 'This field is required.',
    id: 'error',
    label: 'With error',
    name: 'error',
  },
};

export const Required: Story = {
  args: {
    id: 'required',
    label: 'Required field',
    name: 'required',
    required: true,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    id: 'full',
    label: 'Full width',
    name: 'full',
    placeholder: 'Full width input...',
  },
};
