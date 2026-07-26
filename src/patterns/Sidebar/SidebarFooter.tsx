/** Sidebar.Footer — the pinned bottom action (sign out, in every product so far). */

import type { SidebarFooterProps } from './Sidebar.interfaces';

import { FooterButton, FooterLabel, FooterWrapper } from './Sidebar.styled';

export const SidebarFooter = ({
  children,
  className,
  icon,
  isCollapsed = false,
  label,
  onClick,
}: SidebarFooterProps) => (
  <FooterWrapper $isCollapsed={isCollapsed} className={className}>
    {children ?? (
      /* The label is hidden when collapsed, so it also has to be the accessible name. */
      <FooterButton aria-label={label} type='button' onClick={onClick}>
        {icon}
        <FooterLabel $isCollapsed={isCollapsed}>{label}</FooterLabel>
      </FooterButton>
    )}
  </FooterWrapper>
);
