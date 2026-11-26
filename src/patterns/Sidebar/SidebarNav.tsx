/**
 * Sidebar.Nav — the entry list, and the only place that decides which entry is active.
 *
 * The active test used to be copy-pasted into every product's sidebar; it is pure logic over a
 * path, so it belongs here (`isNavItemActive`). The ROUTER does not: the product passes its own
 * `currentPath` and, optionally, its `Link` component via `linkAs`.
 */

import { isNavItemActive } from './Sidebar.helpers';
import type { SidebarNavItem, SidebarNavProps, SidebarNavSection } from './Sidebar.interfaces';

import {
  NavBadge,
  NavGroup,
  NavGroupDivider,
  NavGroupLabel,
  NavGroups,
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
  sections,
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
            /* Collapsed hides the visible label, so the name has to come from here or the link
               reaches a screen reader as an unnamed link. */
            aria-label={item.label}
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

  /**
   * The heading is hidden from assistive tech because the list it heads carries the same name; read
   * twice, it would announce every section as a heading and then as a list. Collapsed, the heading
   * gives way to a rule, so the groups stay visible without text the rail has no room for.
   */
  const renderSection = (section: SidebarNavSection, index: number) => (
    <NavGroup key={section.id}>
      {section.label && !isCollapsed ? (
        <NavGroupLabel aria-hidden>{section.label}</NavGroupLabel>
      ) : null}
      {isCollapsed && index > 0 ? <NavGroupDivider aria-hidden /> : null}
      <NavList $isCollapsed={isCollapsed} aria-label={section.label}>
        {section.items.map(renderItem)}
      </NavList>
    </NavGroup>
  );

  return (
    <NavSection className={className}>
      {sections ? (
        <NavGroups>{sections.map(renderSection)}</NavGroups>
      ) : (
        <NavList $isCollapsed={isCollapsed}>{items.map(renderItem)}</NavList>
      )}
    </NavSection>
  );
};
