/**
 * FormGroup Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { FormGroup } from './FormGroup';
import { Input } from '../Input';

const meta: Meta<typeof FormGroup> = {
  component: FormGroup,
  tags: ['autodocs'],
  title: 'Components/FormGroup',
};

export default meta;
type Story = StoryObj<typeof FormGroup>;

export const Default: Story = {
  args: {
    children: <Input id='email' name='email' placeholder='user@example.com' />,
  },
};

export const MultipleGroups: Story = {
  render: () => (
    <div>
      <FormGroup>
        <Input id='firstName' name='firstName' placeholder='John' />
      </FormGroup>
      <FormGroup>
        <Input id='lastName' name='lastName' placeholder='Doe' />
      </FormGroup>
    </div>
  ),
};
