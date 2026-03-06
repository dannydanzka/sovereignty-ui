/**
 * Tabs Component
 *
 * Tab navigation with icons, badges, and scroll support on mobile.
 */

import { useCallback } from 'react';

import type { TabItem, TabsProps } from './Tabs.interfaces';

import { TabBadge, TabButton, TabContent, TabList, TabsContainer } from './Tabs.styled';

export const Tabs = ({ activeTabId, className, onTabChange, tabs }: TabsProps) => {
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { tabId } = event.currentTarget.dataset;
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && !tab.disabled) {
        onTabChange(tab.id);
      }
    },
    [onTabChange, tabs]
  );

  const renderTab = (tab: TabItem) => {
    const isActive = tab.id === activeTabId;

    return (
      <TabButton
        $isActive={isActive}
        $isDisabled={tab.disabled ?? false}
        aria-selected={isActive}
        data-tab-id={tab.id}
        disabled={tab.disabled}
        key={tab.id}
        role='tab'
        type='button'
        onClick={handleClick}
      >
        {tab.icon}
        {tab.label}
        {tab.badge !== undefined && <TabBadge>{tab.badge}</TabBadge>}
      </TabButton>
    );
  };

  return (
    <TabsContainer className={className}>
      <TabList role='tablist'>{tabs.map(renderTab)}</TabList>
      <TabContent role='tabpanel'>{activeTab?.content}</TabContent>
    </TabsContainer>
  );
};
