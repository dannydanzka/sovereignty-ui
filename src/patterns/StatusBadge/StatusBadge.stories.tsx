/**
 * StatusBadge Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  tags: ['autodocs'],
  title: 'Patterns/StatusBadge',
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = { args: { isActive: true } };

export const Inactive: Story = { args: { isActive: false } };

export const Localized: Story = {
  args: { activeLabel: 'Activo', inactiveLabel: 'Inactivo', isActive: true },
};
