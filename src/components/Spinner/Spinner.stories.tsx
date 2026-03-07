import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  argTypes: {
    color: { control: 'color' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    text: { control: 'text' },
  },
  component: Spinner,
  tags: ['autodocs'],
  title: 'Primitives/Spinner',
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const WithText: Story = {
  args: { text: 'Loading...' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg', text: 'Please wait...' },
};

export const CustomColor: Story = {
  args: { color: '#8B5CF6', text: 'Custom color' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '2rem' }}>
      <Spinner size='sm' text='Small' />
      <Spinner size='md' text='Medium' />
      <Spinner size='lg' text='Large' />
    </div>
  ),
};
