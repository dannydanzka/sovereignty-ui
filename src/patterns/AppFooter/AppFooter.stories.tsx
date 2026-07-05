/**
 * AppFooter Stories
 */

import { Facebook, Instagram, Youtube } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { AppFooter } from './AppFooter';

const meta: Meta<typeof AppFooter> = {
  component: AppFooter,
  tags: ['autodocs'],
  title: 'Patterns/AppFooter',
};

export default meta;
type Story = StoryObj<typeof AppFooter>;

export const Complete: Story = {
  render: () => (
    <AppFooter
      brandSlot={
        <>
          <strong>ACME</strong>
          <span>Building useful things since 2020.</span>
        </>
      }
      columns={[
        {
          content: (
            <>
              <a href='#about'>About</a>
              <a href='#careers'>Careers</a>
            </>
          ),
          title: 'Company',
        },
        {
          content: (
            <>
              <a href='#terms'>Terms</a>
              <a href='#privacy'>Privacy</a>
            </>
          ),
          title: 'Legal',
        },
      ]}
      copyright='© 2026 ACME. All rights reserved.'
      socialSlot={
        <>
          <a aria-label='Facebook' href='#fb'>
            <Facebook size={18} />
          </a>
          <a aria-label='Instagram' href='#ig'>
            <Instagram size={18} />
          </a>
          <a aria-label='YouTube' href='#yt'>
            <Youtube size={18} />
          </a>
        </>
      }
    />
  ),
};

export const Minimal: Story = {
  args: {
    copyright: '© 2026 ACME',
  },
};
