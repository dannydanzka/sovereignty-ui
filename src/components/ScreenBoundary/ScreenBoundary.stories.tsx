/**
 * ScreenBoundary Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ScreenBoundary } from './ScreenBoundary';

const meta: Meta<typeof ScreenBoundary> = {
  argTypes: {
    error: { control: 'text' },
    isLoading: { control: 'boolean' },
    loadingMessage: { control: 'text' },
    title: { control: 'text' },
  },
  component: ScreenBoundary,
  tags: ['autodocs'],
  title: 'Layout/ScreenBoundary',
};

export default meta;
type Story = StoryObj<typeof ScreenBoundary>;

export const WithContent: Story = {
  args: {
    children: <div style={{ background: '#F5F7FA', padding: '16px' }}>Screen content loaded</div>,
    isLoading: false,
    title: 'Users',
  },
};

export const Loading: Story = {
  args: {
    children: <div>This will not render</div>,
    isLoading: true,
    loadingMessage: 'Loading users...',
    title: 'Users',
  },
};

export const Error: Story = {
  args: {
    children: <div>This will not render</div>,
    error: 'Failed to load users. Please try again.',
    isLoading: false,
    title: 'Users',
  },
};
