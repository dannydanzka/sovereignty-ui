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

export const WithCharacterCount: Story = {
  args: {
    id: 'counted',
    label: 'Con contador',
    maxLength: 40,
    name: 'counted',
    placeholder: 'Máximo 40 caracteres…',
    showCount: true,
    value: 'Andamio tubular',
  },
};

export const CountAndError: Story = {
  args: {
    error: 'Requerido',
    id: 'counted-error',
    label: 'Contador + error',
    maxLength: 20,
    name: 'counted-error',
    showCount: true,
    value: 'Andamio tubular',
  },
};

export const DateBounded: Story = {
  args: {
    id: 'start-date',
    label: 'Fecha de inicio',
    max: '2026-12-31',
    min: '2026-01-01',
    name: 'startDate',
    type: 'date',
  },
};

export const NumberWithStep: Story = {
  args: {
    id: 'daily-rate',
    label: 'Tarifa diaria',
    min: 0,
    name: 'dailyRate',
    placeholder: '0.00',
    step: '0.01',
    type: 'number',
  },
};
