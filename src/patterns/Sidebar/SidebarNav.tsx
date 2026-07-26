/**
 * Sidebar.Nav — the entry list, and the only place that decides which entry is active.
 *
 * The active test used to be copy-pasted into every product's sidebar; it is pure logic over a
 * path, so it belongs here (`isNavItemActive`). The ROUTER does not: the product passes its own
 * `currentPath` and, optionally, its `Link` component via `linkAs`.
 */

import { isNavItemActive } from './Sidebar.helpers';
import type { SidebarNavItem, SidebarNavProps } from './Sidebar.interfaces';

import {
  NavBadge,
  NavIcon,
  NavItem,
  NavItemWrapper,
  NavLabel,
  NavLink,
  NavList,
  NavSection,
  NavTooltip,
} from './Sidebar.styled';

export const SidebarNav = ({
  className,
  currentPath,
  homeHref,
  isCollapsed = false,
  items,
  linkAs,
  linkProps,
  onNavigate,
}: SidebarNavProps) => {
  const renderItem = (item: SidebarNavItem) => {
    const isActive = isNavItemActive({ currentPath, homeHref, href: item.href });

    return (
      <NavItem key={item.id}>
        <NavItemWrapper>
          <NavLink
            $isActive={isActive}
            $isCollapsed={isCollapsed}
            aria-current={isActive ? 'page' : undefined}
            as={linkAs}
            href={item.href}
            onClick={onNavigate}
            {...linkProps}
          >
            {item.icon ? <NavIcon>{item.icon}</NavIcon> : null}
            <NavLabel $isCollapsed={isCollapsed}>{item.label}</NavLabel>
            {item.badge ? <NavBadge $isCollapsed={isCollapsed}>{item.badge}</NavBadge> : null}
          </NavLink>
          {/* Collapsed rail shows icons only — the tooltip is the label's stand-in. */}
          {isCollapsed ? <NavTooltip>{item.label}</NavTooltip> : null}
        </NavItemWrapper>
      </NavItem>
    );
  };

  return (
    <NavSection className={className}>
      <NavList $isCollapsed={isCollapsed}>{items.map(renderItem)}</NavList>
    </NavSection>
  );
};
