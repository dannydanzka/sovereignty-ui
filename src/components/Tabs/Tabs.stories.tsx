/**
 * Tabs Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from './Tabs';

const meta = {
  component: Tabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Components/Tabs',
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  {
    content: <div style={{ padding: '16px' }}>Content of Tab 1</div>,
    id: 'tab1',
    label: 'Overview',
  },
  {
    badge: 3,
    content: <div style={{ padding: '16px' }}>Content of Tab 2</div>,
    id: 'tab2',
    label: 'Details',
  },
  {
    content: <div style={{ padding: '16px' }}>Content of Tab 3</div>,
    disabled: true,
    id: 'tab3',
    label: 'Disabled',
  },
];

const InteractiveTabs = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return <Tabs activeTabId={activeTab} tabs={sampleTabs} onTabChange={setActiveTab} />;
};

export const AllVariants: Story = {
  args: { activeTabId: 'tab1', onTabChange: () => {}, tabs: sampleTabs },
  render: () => <InteractiveTabs />,
};

export const Default: Story = {
  args: { activeTabId: 'tab1', onTabChange: () => {}, tabs: sampleTabs },
};

export const WithBadge: Story = {
  args: {
    activeTabId: 'tab2',
    onTabChange: () => {},
    tabs: [
      { content: <div>All items</div>, id: 'all', label: 'All' },
      { badge: 5, content: <div>Pending items</div>, id: 'pending', label: 'Pending' },
      { badge: 12, content: <div>Completed items</div>, id: 'done', label: 'Completed' },
    ],
  },
};
