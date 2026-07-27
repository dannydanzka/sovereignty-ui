/**
 * Tabs Component
 *
 * Tab navigation with icons, badges, and scroll support on mobile.
 *
 * The `role="tab"` / `role="tabpanel"` pair is only half of the ARIA tabs contract, and the missing
 * half is what makes a tab bar unusable without a mouse:
 * - each tab is `aria-controls`-linked to the panel and the panel `aria-labelledby`-linked back, so a
 *   screen reader announces which panel it landed in instead of an unlabelled region;
 * - the tablist is ONE tab stop (`tabIndex` follows the active tab) and Left/Right/Home/End move
 *   between tabs, which is how a tablist is expected to behave — before this, reaching the third tab
 *   meant three Tab presses and the panel never announced itself.
 */

import { useCallback, useRef } from 'react';

import { TAB_KEY } from './Tabs.constants';
import type { TabItem, TabsProps } from './Tabs.interfaces';

import { TabBadge, TabButton, TabContent, TabList, TabsContainer } from './Tabs.styled';

/** Ids are derived, not props: the caller already gave every tab a unique `id`. */
const tabButtonId = (tabId: string) => `tab-${tabId}`;
const tabPanelId = (tabId: string) => `tabpanel-${tabId}`;

export const Tabs = ({ activeTabId, className, onTabChange, tabs }: TabsProps) => {
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const listRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const selectable = tabs.filter((tab) => !tab.disabled);
      if (selectable.length === 0) return;

      const currentIndex = selectable.findIndex((tab) => tab.id === activeTabId);
      let nextIndex: null | number = null;

      /* Wrap around on both ends — a tablist that dead-ends at the last tab makes the user reverse
         direction to get back to the first one. */
      if (event.key === TAB_KEY.NEXT) {
        nextIndex = (currentIndex + 1) % selectable.length;
      } else if (event.key === TAB_KEY.PREVIOUS) {
        nextIndex = (currentIndex - 1 + selectable.length) % selectable.length;
      } else if (event.key === TAB_KEY.HOME) {
        nextIndex = 0;
      } else if (event.key === TAB_KEY.END) {
        nextIndex = selectable.length - 1;
      }

      if (nextIndex === null) return;

      const nextTab = selectable[nextIndex];
      if (!nextTab) return;

      event.preventDefault();
      onTabChange(nextTab.id);
      /* Move focus with the selection: an automatic-activation tablist keeps focus on the tab the
         user just selected, otherwise the next arrow press starts from the wrong place. */
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab.id}"]`)?.focus();
    },
    [activeTabId, onTabChange, tabs]
  );

  const renderTab = (tab: TabItem) => {
    const isActive = tab.id === activeTabId;

    return (
      <TabButton
        $isActive={isActive}
        $isDisabled={tab.disabled ?? false}
        aria-controls={tabPanelId(tab.id)}
        aria-selected={isActive}
        data-tab-id={tab.id}
        disabled={tab.disabled}
        id={tabButtonId(tab.id)}
        key={tab.id}
        role='tab'
        tabIndex={isActive ? 0 : -1}
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
      <TabList ref={listRef} role='tablist' onKeyDown={handleKeyDown}>
        {tabs.map(renderTab)}
      </TabList>
      <TabContent
        aria-labelledby={activeTab ? tabButtonId(activeTab.id) : undefined}
        id={activeTab ? tabPanelId(activeTab.id) : undefined}
        role='tabpanel'
      >
        {activeTab?.content}
      </TabContent>
    </TabsContainer>
  );
};
