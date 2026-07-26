/**
 * BackLink Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { BackLink } from './BackLink';

const meta = {
  component: BackLink,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/BackLink',
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '← Back to rentals', href: '#' },
};
