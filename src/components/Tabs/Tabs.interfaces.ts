/**
 * Tabs Component Interfaces
 */

import type { ReactNode } from 'react';

export interface TabItem {
  badge?: number | string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
}

export interface TabsProps {
  activeTabId: string;
  className?: string;
  onTabChange: (tabId: string) => void;
  tabs: TabItem[];
}
