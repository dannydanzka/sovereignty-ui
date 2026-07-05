/**
 * FormFields Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { SelectField, TextareaField, TextField } from './FormFields';

const meta: Meta<typeof TextField> = {
  component: TextField,
  tags: ['autodocs'],
  title: 'Patterns/FormFields',
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const CompleteForm: Story = {
  render: () => (
    <form>
      <TextField
        helpText='We never share your email'
        id='email'
        label='Email'
        placeholder='you@example.com'
        type='email'
      />
      <SelectField
        id='role'
        label='Role'
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
        ]}
        placeholder='Pick a role'
      />
      <TextareaField helpText='Max 500 characters' id='bio' label='Bio' rows={4} />
    </form>
  ),
};

export const WithErrors: Story = {
  render: () => (
    <form>
      <TextField error='Email is required' id='email2' label='Email' required />
      <SelectField
        error='Pick one option'
        id='role2'
        label='Role'
        options={[{ label: 'Admin', value: 'admin' }]}
        required
      />
    </form>
  ),
};
