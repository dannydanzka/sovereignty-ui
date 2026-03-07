import type { Meta, StoryObj } from '@storybook/react';

import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  argTypes: {
    variant: { control: 'radio', options: ['info', 'success', 'warning', 'error'] },
  },
  component: Alert,
  tags: ['autodocs'],
  title: 'Components/Alert',
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    children: 'This is an informational message.',
    title: 'Information',
    variant: 'info',
  },
};

export const Success: Story = {
  args: {
    children: 'Operation completed successfully.',
    title: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Please review before continuing.',
    title: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Something went wrong. Please try again.',
    title: 'Error',
    variant: 'error',
  },
};

export const Dismissible: Story = {
  args: {
    children: 'You can dismiss this alert.',
    onDismiss: () => alert('Dismissed'),
    title: 'Dismissible',
    variant: 'info',
  },
};

export const NoTitle: Story = {
  args: {
    children: 'A simple alert without a title.',
    variant: 'warning',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert title='Info' variant='info'>
        Informational message.
      </Alert>
      <Alert title='Success' variant='success'>
        Operation completed.
      </Alert>
      <Alert title='Warning' variant='warning'>
        Review required.
      </Alert>
      <Alert title='Error' variant='error'>
        Something went wrong.
      </Alert>
    </div>
  ),
};
