/**
 * PageHeader Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../components/Button';
import { PageHeader } from './PageHeader';

const meta = {
  component: PageHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/PageHeader',
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: '8 records in total.', title: 'Clients' },
};

export const WithAction: Story = {
  args: {
    actions: <Button variant='primary'>New client</Button>,
    description: '8 records in total.',
    title: 'Clients',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Clients' },
};
