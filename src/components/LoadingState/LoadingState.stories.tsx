/**
 * LoadingState Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  component: LoadingState,
  tags: ['autodocs'],
  title: 'Components/LoadingState',
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    message: 'Loading data...',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Processing your request, please wait...',
  },
};
