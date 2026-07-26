/**
 * Sidebar — the collapsible navigation rail of an authenticated app, plus `SidebarLayout`, the
 * shell that offsets the page beside it.
 *
 * Web-only: it is `position: fixed`, media-query driven and mouse-hover driven. React Native has
 * no equivalent, so this pattern is exported from the web barrel only rather than pretending to a
 * dual API.
 *
 * Every product that has an admin area rebuilds this: container, mobile overlay, identity header,
 * entry list with active state, pinned sign-out — plus a shell whose left margin must match the
 * rail's width. Two surfaces of the SAME product routinely end up with two copies that differ
 * only in colour, and then drift.
 *
 * Re-skin with CSS custom properties, never by forking:
 *
 *   --sui-sidebar-bg · -header-bg · -border · -fg · -fg-muted
 *   --sui-sidebar-hover-bg · -active-bg · -active-fg · -active-marker · -avatar-bg
 *   --sui-sidebar-width · -width-collapsed   (read by BOTH the rail and the content offset)
 */

import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import type { SidebarLayoutProps, SidebarProps } from './Sidebar.interfaces';
import { SidebarNav } from './SidebarNav';

import {
  LayoutBody,
  LayoutContent,
  LayoutShell,
  SidebarContainer,
  SidebarOverlay,
} from './Sidebar.styled';

export const Sidebar = ({
  children,
  className,
  isCollapsed = false,
  isMobileOpen = false,
  onOverlayClick,
}: SidebarProps) => (
  <>
    <SidebarOverlay
      $isVisible={isMobileOpen}
      data-testid='sidebar-overlay'
      onClick={onOverlayClick}
    />
    <SidebarContainer
      $isCollapsed={isCollapsed}
      $isMobileOpen={isMobileOpen}
      className={className}
      data-testid='sidebar'
    >
      {children}
    </SidebarContainer>
  </>
);

Sidebar.Footer = SidebarFooter;
Sidebar.Header = SidebarHeader;
Sidebar.Nav = SidebarNav;

export const SidebarLayoutRoot = ({ children, className, style, ...rest }: SidebarLayoutProps) => (
  <LayoutShell className={className} style={style} {...rest}>
    {children}
  </LayoutShell>
);

export const SidebarLayoutContent = ({
  children,
  className,
  isCollapsed = false,
}: SidebarLayoutProps) => (
  <LayoutContent
    $isCollapsed={isCollapsed}
    className={className}
    data-testid='sidebar-layout-content'
  >
    {children}
  </LayoutContent>
);

export const SidebarLayoutBody = ({ children, className }: SidebarLayoutProps) => (
  <LayoutBody className={className}>{children}</LayoutBody>
);

export const SidebarLayout = Object.assign(SidebarLayoutRoot, {
  Body: SidebarLayoutBody,
  Content: SidebarLayoutContent,
});
