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

const SECTIONS = [
  { id: 'home', items: [{ href: '/admin', id: 'home', label: 'Dashboard' }] },
  {
    id: 'operation',
    items: [
      { href: '/admin/quotes', id: 'quotes', label: 'Quotes' },
      { badge: 15, href: '/admin/rentals', id: 'rentals', label: 'Rentals' },
      { href: '/admin/clients', id: 'clients', label: 'Clients' },
    ],
    label: 'Operation',
  },
  {
    id: 'settings',
    items: [
      { href: '/admin/users', id: 'users', label: 'Users' },
      { href: '/admin/roles', id: 'roles', label: 'Roles' },
    ],
    label: 'Settings',
  },
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

const Demo = ({ brand = false, sectioned = false }: { brand?: boolean; sectioned?: boolean }) => {
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
        {sectioned ? (
          <Sidebar.Nav
            currentPath='/admin/rentals'
            homeHref='/admin'
            isCollapsed={isCollapsed}
            sections={SECTIONS}
          />
        ) : (
          <Sidebar.Nav
            currentPath='/admin/inventory'
            homeHref='/admin'
            isCollapsed={isCollapsed}
            items={ITEMS}
          />
        )}
        <Sidebar.Footer isCollapsed={isCollapsed} label='Sign out' />
      </Sidebar>
    </div>
  );
};

/** Click the avatar to collapse the rail. */
export const Default: Story = { args: { children: null }, render: () => <Demo /> };

/** Re-skinned entirely through `--sui-sidebar-*` custom properties — no forked structure. */
export const Branded: Story = { args: { children: null }, render: () => <Demo brand /> };

/** Entries grouped by the job they serve, in one scrolling nav; collapsed, headings become rules. */
export const Sectioned: Story = {
  args: { children: null },
  render: () => <Demo sectioned />,
};
