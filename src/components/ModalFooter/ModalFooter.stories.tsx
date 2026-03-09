/**
 * ModalFooter Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ModalFooter } from './ModalFooter';

const meta: Meta<typeof ModalFooter> = {
  component: ModalFooter,
  tags: ['autodocs'],
  title: 'Components/ModalFooter',
};

export default meta;
type Story = StoryObj<typeof ModalFooter>;

export const AlignRight: Story = {
  args: {
    align: 'right',
    children: (
      <>
        <Button variant='secondary'>Cancel</Button>
        <Button>Save</Button>
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
        <Button>Next</Button>
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    align: 'space-between',
    children: (
      <>
        <Button variant='danger'>Delete</Button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant='secondary'>Cancel</Button>
          <Button>Save</Button>
        </div>
      </>
    ),
  },
};
