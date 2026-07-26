/** Sidebar pattern contracts. */

import type { ComponentType, ReactNode } from 'react';

export interface SidebarNavItem {
  /** Optional count/dot rendered on the right (or over the icon when collapsed). */
  badge?: ReactNode;
  href: string;
  icon?: ReactNode;
  id: string;
  label: string;
}

export interface SidebarProps {
  children: ReactNode;
  className?: string;
  /** Narrow rail: labels collapse away, only icons remain. */
  isCollapsed?: boolean;
  /** Off-canvas drawer state below `lg`. */
  isMobileOpen?: boolean;
  /** Tap on the mobile backdrop — always close the drawer. */
  onOverlayClick?: () => void;
}

export interface SidebarHeaderProps {
  /** Short qualifier next to the identity (a role, a plan). Hidden when collapsed. */
  badge?: ReactNode;
  className?: string;
  closeLabel: string;
  collapseLabel: string;
  email?: string;
  expandLabel: string;
  /** Avatar content — initials, or an `Avatar`/`Image`. */
  initials?: ReactNode;
  isCollapsed?: boolean;
  name?: string;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export interface SidebarNavProps {
  className?: string;
  /** Current location, supplied by the product's router (the library owns no router). */
  currentPath: string;
  /** The one entry matched exactly instead of by prefix — otherwise it is always active. */
  homeHref?: string;
  isCollapsed?: boolean;
  items: SidebarNavItem[];
  /**
   * Link component to render each entry with (e.g. Next's `Link`). Defaults to a plain anchor,
   * so the pattern works without a router at all.
   */
  linkAs?: ComponentType<Record<string, unknown>>;
  /** Extra props forwarded to every link (e.g. `prefetch={false}`). */
  linkProps?: Record<string, unknown>;
  /** Fires on every entry click — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export interface SidebarFooterProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  isCollapsed?: boolean;
  /** Hidden when collapsed; the icon carries the meaning, so it is also the accessible name. */
  label?: string;
  onClick?: () => void;
}

export interface SidebarLayoutProps {
  children: ReactNode;
  className?: string;
  /** Must mirror the `Sidebar` value: it drives the content offset. */
  isCollapsed?: boolean;
}

export interface IsNavItemActiveOptions {
  currentPath: string;
  /** The entry matched exactly rather than by prefix (the section root). */
  homeHref?: string;
  href: string;
}

export interface StyledSidebarProps {
  $isCollapsed: boolean;
  $isMobileOpen: boolean;
}

export interface StyledSidebarNavLinkProps {
  $isActive: boolean;
  $isCollapsed: boolean;
}

export interface StyledSidebarCollapsibleProps {
  $isCollapsed: boolean;
}
