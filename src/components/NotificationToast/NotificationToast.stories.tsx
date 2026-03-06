/**
 * NotificationToast Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { NotificationToast } from './NotificationToast';

const meta: Meta<typeof NotificationToast> = {
  component: NotificationToast,
  tags: ['autodocs'],
  title: 'Components/NotificationToast',
};

export default meta;
type Story = StoryObj<typeof NotificationToast>;

export const AllVariants: Story = {
  args: { notification: { id: '1', message: 'Operation completed.', type: 'info' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <NotificationToast
        notification={{ id: '1', message: 'Operation completed successfully.', type: 'success' }}
      />
      <NotificationToast notification={{ id: '2', message: 'An error occurred.', type: 'error' }} />
      <NotificationToast
        notification={{ id: '3', message: 'Please review this.', type: 'warning' }}
      />
      <NotificationToast
        notification={{ id: '4', message: 'Here is some information.', type: 'info' }}
      />
    </div>
  ),
};

export const WithTitle: Story = {
  args: {
    notification: {
      id: '1',
      message: 'Your profile has been updated.',
      title: 'Success',
      type: 'success',
    },
  },
};

export const Success: Story = {
  args: {
    notification: { id: '1', message: 'Operation completed successfully.', type: 'success' },
  },
};

export const Error: Story = {
  args: {
    notification: { id: '2', message: 'Something went wrong.', type: 'error' },
  },
};

export const Warning: Story = {
  args: {
    notification: { id: '3', message: 'Please check your input.', type: 'warning' },
  },
};

export const Info: Story = {
  args: {
    notification: { id: '4', message: 'Here is some information.', type: 'info' },
  },
};
