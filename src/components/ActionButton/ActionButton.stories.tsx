/**
 * ActionButton Stories
 */

import { Eye, Pencil, Trash2 } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    variant: { control: 'select', options: ['view', 'edit', 'delete', 'neutral'] },
  },
  component: ActionButton,
  tags: ['autodocs'],
  title: 'Components/ActionButton',
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Edit: Story = {
  args: {
    icon: <Pencil size={14} />,
    title: 'Edit',
    variant: 'edit',
  },
};

export const RowActions: Story = {
  render: () => (
    <div>
      <ActionButton icon={<Eye size={14} />} title='View' variant='view' onClick={() => {}} />{' '}
      <ActionButton icon={<Pencil size={14} />} title='Edit' variant='edit' onClick={() => {}} />{' '}
      <ActionButton
        icon={<Trash2 size={14} />}
        title='Delete'
        variant='delete'
        onClick={() => {}}
      />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    icon: <Pencil size={14} />,
    isLoading: true,
    title: 'Saving',
    variant: 'edit',
  },
};
