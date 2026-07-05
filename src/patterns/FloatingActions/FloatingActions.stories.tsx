/**
 * FloatingActions Stories
 */

import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { FloatingActions } from './FloatingActions';

const meta: Meta<typeof FloatingActions> = {
  argTypes: {
    side: { control: 'select', options: ['left', 'right'] },
  },
  component: FloatingActions,
  tags: ['autodocs'],
  title: 'Patterns/FloatingActions',
};

export default meta;
type Story = StoryObj<typeof FloatingActions>;

export const SocialLinks: Story = {
  args: {
    items: [
      { href: 'https://facebook.com/acme', icon: <Facebook />, label: 'Facebook' },
      { href: 'https://instagram.com/acme', icon: <Instagram />, label: 'Instagram' },
      { href: 'https://youtube.com/@acme', icon: <Youtube />, label: 'YouTube' },
    ],
  },
};

export const WithActionButton: Story = {
  args: {
    items: [
      { href: 'https://instagram.com/acme', icon: <Instagram />, label: 'Instagram' },
      { icon: <MessageCircle />, label: 'Open chat', onClick: () => {} },
    ],
    side: 'left',
  },
};
