/**
 * Sidebar Stories
 */

import type { CSSProperties } from 'react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Sidebar } from './Sidebar';

const ITEMS = [
  { href: '/admin', id: 'home', label: 'Dashboard' },
  { href: '/admin/inventory', id: 'inventory', label: 'Inventory' },
  { href: '/admin/clients', id: 'clients', label: 'Clients' },
  { badge: 3, href: '/admin/messages', id: 'messages', label: 'Messages' },
];

const meta = {
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  title: 'Patterns/Sidebar',
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** How a product re-skins the rail: the vars go on a WRAPPER, never as colour props. */
const BRAND_VARS = {
  '--sui-sidebar-active-marker': '#FFD166',
  '--sui-sidebar-bg': '#1A237E',
  '--sui-sidebar-border': 'rgba(255, 255, 255, 0.14)',
  '--sui-sidebar-header-bg': '#111A5C',
} as CSSProperties;

const Demo = ({ brand = false }: { brand?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={brand ? BRAND_VARS : undefined}>
      <Sidebar isCollapsed={isCollapsed}>
        <Sidebar.Header
          badge='Owner'
          closeLabel='Close'
          collapseLabel='Collapse'
          email='maria@example.com'
          expandLabel='Expand'
          initials='MG'
          isCollapsed={isCollapsed}
          name='María García'
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />
        <Sidebar.Nav
          currentPath='/admin/inventory'
          homeHref='/admin'
          isCollapsed={isCollapsed}
          items={ITEMS}
        />
        <Sidebar.Footer isCollapsed={isCollapsed} label='Sign out' />
      </Sidebar>
    </div>
  );
};

/** Click the avatar to collapse the rail. */
export const Default: Story = { args: { children: null }, render: () => <Demo /> };

/** Re-skinned entirely through `--sui-sidebar-*` custom properties — no forked structure. */
export const Branded: Story = { args: { children: null }, render: () => <Demo brand /> };
