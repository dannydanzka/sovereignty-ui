/**
 * FormActions Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FormActions } from './FormActions';

const meta: Meta<typeof FormActions> = {
  component: FormActions,
  tags: ['autodocs'],
  title: 'Components/FormActions',
};

export default meta;
type Story = StoryObj<typeof FormActions>;

export const AlignRight: Story = {
  args: {
    align: 'right',
    children: (
      <>
        <Button variant='secondary'>Cancel</Button>
        <Button>Submit</Button>
      </>
    ),
  },
};

export const AlignLeft: Story = {
  args: {
    align: 'left',
    children: (
      <>
        <Button variant='secondary'>Back</Button>
        <Button>Continue</Button>
      </>
    ),
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
    children: <Button>Save Changes</Button>,
  },
};
