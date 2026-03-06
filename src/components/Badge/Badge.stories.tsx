/**
 * Badge Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  title: 'Components/Badge',
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const AllVariants: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <Badge variant='default'>Default</Badge>
      <Badge variant='primary'>Primary</Badge>
      <Badge variant='success'>Success</Badge>
      <Badge variant='warning'>Warning</Badge>
      <Badge variant='danger'>Danger</Badge>
      <Badge variant='info'>Info</Badge>
      <Badge variant='secondary'>Secondary</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  args: { children: 'Badge', variant: 'primary' },
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
      <Badge size='sm' variant='primary'>
        Small
      </Badge>
      <Badge size='md' variant='primary'>
        Medium
      </Badge>
      <Badge size='lg' variant='primary'>
        Large
      </Badge>
    </div>
  ),
};

export const Default: Story = {
  args: { children: 'Default', variant: 'default' },
};

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
};

export const Success: Story = {
  args: { children: 'Success', variant: 'success' },
};

export const Danger: Story = {
  args: { children: 'Danger', variant: 'danger' },
};
