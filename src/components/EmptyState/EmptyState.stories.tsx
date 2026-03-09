/**
 * EmptyState Stories
 */

import { Database, FileText, Users } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  tags: ['autodocs'],
  title: 'Components/EmptyState',
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <Database />,
    message: 'No data available at the moment.',
    title: 'No data',
  },
};

export const WithAction: Story = {
  args: {
    action: <Button size='sm'>Create New</Button>,
    icon: <FileText />,
    message: 'Get started by creating your first item.',
    title: 'No items yet',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <Users />,
    message: 'No users match the current filters.',
    title: 'No users found',
  },
};

export const MinimalNoIcon: Story = {
  args: {
    message: 'Nothing to show here.',
    title: 'Empty',
  },
};
