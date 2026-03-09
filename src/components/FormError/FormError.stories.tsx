/**
 * FormError Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { FormError } from './FormError';

const meta: Meta<typeof FormError> = {
  component: FormError,
  tags: ['autodocs'],
  title: 'Components/FormError',
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const FormLevel: Story = {
  args: {
    children: 'An error occurred while saving the form.',
    variant: 'form',
  },
};

export const FieldLevel: Story = {
  args: {
    children: 'This field is required.',
    variant: 'field',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <FormError variant='form'>Form-level error: Could not save changes.</FormError>
      <FormError variant='field'>Field-level error: Invalid email format.</FormError>
    </div>
  ),
};
