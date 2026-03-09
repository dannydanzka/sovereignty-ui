/**
 * InfoMessage Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { InfoMessage } from './InfoMessage';

const meta: Meta<typeof InfoMessage> = {
  component: InfoMessage,
  tags: ['autodocs'],
  title: 'Components/InfoMessage',
};

export default meta;
type Story = StoryObj<typeof InfoMessage>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InfoMessage variant='info'>This is an informational message.</InfoMessage>
      <InfoMessage variant='success'>Operation completed successfully.</InfoMessage>
      <InfoMessage variant='warning'>Please review the data before continuing.</InfoMessage>
      <InfoMessage variant='error'>An error occurred while processing.</InfoMessage>
    </div>
  ),
};

export const Info: Story = {
  args: {
    children: 'This action will update all related records.',
    variant: 'info',
  },
};

export const Success: Story = {
  args: {
    children: 'All changes have been saved.',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'This operation cannot be undone.',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Failed to save changes. Please try again.',
    variant: 'error',
  },
};
