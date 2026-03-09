/**
 * ErrorState Stories
 */

import { WifiOff } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  component: ErrorState,
  tags: ['autodocs'],
  title: 'Components/ErrorState',
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    message: 'An unexpected error occurred. Please try again.',
    title: 'Error',
  },
};

export const WithRetryAction: Story = {
  args: {
    action: <Button size='sm'>Try again</Button>,
    message: 'Failed to load data. Please try again later.',
    title: 'Something went wrong',
  },
};

export const NetworkError: Story = {
  args: {
    action: (
      <Button size='sm' variant='secondary'>
        Retry connection
      </Button>
    ),
    icon: <WifiOff />,
    message: 'Check your internet connection and try again.',
    title: 'Connection lost',
  },
};

export const MinimalMessage: Story = {
  args: {
    message: 'Could not process your request.',
  },
};
