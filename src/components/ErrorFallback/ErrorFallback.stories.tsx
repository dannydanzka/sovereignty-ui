import { Bug, WifiOff } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { ErrorFallback } from './ErrorFallback';

const meta: Meta<typeof ErrorFallback> = {
  argTypes: {
    description: { control: 'text' },
    retryLabel: { control: 'text' },
    title: { control: 'text' },
  },
  component: ErrorFallback,
  tags: ['autodocs'],
  title: 'Components/ErrorFallback',
};

export default meta;

type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {
  args: {
    onRetry: () => alert('Retry clicked'),
  },
};

export const NetworkError: Story = {
  args: {
    description: 'Unable to connect to the server. Check your internet connection.',
    icon: <WifiOff size={48} />,
    onRetry: () => alert('Retry'),
    retryLabel: 'Reconnect',
    title: 'Connection Lost',
  },
};

export const WithActions: Story = {
  args: {
    actions: [
      { label: 'Go Home', onClick: () => alert('Home') },
      { label: 'Report Bug', onClick: () => alert('Report') },
    ],
    description: 'The application encountered an unexpected error.',
    icon: <Bug size={48} />,
    onRetry: () => alert('Retry'),
    title: 'Application Error',
  },
};

export const NoRetry: Story = {
  args: {
    actions: [{ label: 'Go Back', onClick: () => alert('Back') }],
    description: 'This page does not exist.',
    title: 'Page Not Found',
  },
};
