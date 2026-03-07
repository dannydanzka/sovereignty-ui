import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  component: Avatar,
  tags: ['autodocs'],
  title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithInitials: Story = {
  args: { name: 'Danny Ramirez' },
};

export const SingleName: Story = {
  args: { name: 'Danny' },
};

export const NoName: Story = {
  args: {},
};

export const WithImage: Story = {
  args: {
    name: 'Danny',
    src: 'https://i.pravatar.cc/150?img=3',
  },
};

export const BrokenImage: Story = {
  args: {
    name: 'Maria Garcia',
    src: 'https://broken-url.example/avatar.jpg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
      <Avatar name='DR' size='sm' />
      <Avatar name='DR' size='md' />
      <Avatar name='DR' size='lg' />
      <Avatar name='DR' size='xl' />
    </div>
  ),
};
