/**
 * AppHeader Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { AppHeader } from './AppHeader';
import { Button } from '../../components/Button';

const meta: Meta<typeof AppHeader> = {
  component: AppHeader,
  tags: ['autodocs'],
  title: 'Patterns/AppHeader',
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Complete: Story = {
  render: () => (
    <AppHeader
      actionsSlot={<Button size='sm'>Sign in</Button>}
      logoSlot={<strong>ACME</strong>}
      mobileMenuContent={
        <div>
          <div>
            <a href='#features'>Features</a>
          </div>
          <div>
            <a href='#pricing'>Pricing</a>
          </div>
        </div>
      }
      navSlot={
        <>
          <a href='#features'>Features</a>
          <a href='#pricing'>Pricing</a>
          <a href='#docs'>Docs</a>
        </>
      }
    />
  ),
};

export const LogoOnly: Story = {
  args: {
    logoSlot: <strong>ACME</strong>,
    sticky: false,
  },
};
