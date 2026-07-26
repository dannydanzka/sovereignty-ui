/**
 * AppHeader Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { AppHeader } from './AppHeader';

const meta = {
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  title: 'Patterns/AppHeader',
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const SLOTS = {
  actionsSlot: <a href='#actions'>Sign in</a>,
  logoSlot: <strong>ACME</strong>,
  mobileMenuContent: <a href='#mobile'>Pricing</a>,
  navSlot: <a href='#nav'>Pricing</a>,
};

export const Default: Story = { args: SLOTS };

/**
 * Over a hero: the bar flips its own colour and everything in the slots inherits it — no `isOnDark`
 * flag threaded through the logo, the links and the icons.
 */
export const Transparent: Story = {
  args: { ...SLOTS, floating: true, transparent: true },
  render: (args) => (
    <div style={{ background: 'linear-gradient(160deg, #1A237E, #4A148C)', minHeight: '60vh' }}>
      <AppHeader {...args} />
    </div>
  ),
};

/** Hidden — what `useHeaderScroll` produces while the reader scrolls down. */
export const Hidden: Story = { args: { ...SLOTS, hidden: true } };
