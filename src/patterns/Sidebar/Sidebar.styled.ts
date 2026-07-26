/**
 * Sidebar Styled Components
 *
 * Theming seam: every colour reads a `--sui-sidebar-*` custom property with a dark default. A
 * product re-skins the whole rail by declaring those vars on a wrapper — it never forks the
 * structure and never passes a raw colour in as a prop (which would be a hardcoded-value backdoor).
 *
 * The two WIDTHS are vars for a different reason: the rail and the content offset must agree, and
 * they live in different components. Hardcoding them in both is how a collapsed sidebar ends up
 * with a gap beside it.
 */

import styled, { css } from 'styled-components';

import { c, el, mo, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { layout } from '../../tokens/tokens';
import type {
  StyledSidebarCollapsibleProps,
  StyledSidebarNavLinkProps,
  StyledSidebarProps,
} from './Sidebar.interfaces';

const WIDTH = 'var(--sui-sidebar-width, 260px)';
const WIDTH_COLLAPSED = 'var(--sui-sidebar-width-collapsed, 72px)';
const BG = `var(--sui-sidebar-bg, linear-gradient(180deg, ${c('neutral900')} 0%, ${c('neutral800')} 100%))`;
const HEADER_BG = `var(--sui-sidebar-header-bg, ${c('neutral800')})`;
const BORDER = `var(--sui-sidebar-border, ${c('neutral700')})`;
const FG = `var(--sui-sidebar-fg, ${c('neutral100')})`;
const FG_MUTED = `var(--sui-sidebar-fg-muted, ${c('neutral400')})`;
const HOVER_BG = `var(--sui-sidebar-hover-bg, ${c('neutral700')})`;
const ACTIVE_BG = `var(--sui-sidebar-active-bg, ${c('neutral700')})`;
const ACTIVE_FG = `var(--sui-sidebar-active-fg, ${c('white')})`;
const ACTIVE_MARKER = `var(--sui-sidebar-active-marker, ${c('primary500')})`;
const AVATAR_BG = `var(--sui-sidebar-avatar-bg, ${c('primary500')})`;

const MOBILE = `@media (max-width: ${layout.breakpoint.lg})`;

export const SidebarContainer = styled.aside<StyledSidebarProps>`
  background: ${BG};
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  transition: ${mo('normal')};
  width: ${({ $isCollapsed }) => ($isCollapsed ? WIDTH_COLLAPSED : WIDTH)};
  z-index: ${layout.zIndex.fixed};

  ${MOBILE} {
    box-shadow: ${({ $isMobileOpen }) => ($isMobileOpen ? el('lg') : 'none')};
    transform: translateX(${({ $isMobileOpen }) => ($isMobileOpen ? '0' : '-100%')});
    width: ${WIDTH};
  }
`;

export const SidebarOverlay = styled.div<{ $isVisible: boolean }>`
  background-color: ${c('overlay')};
  display: none;
  inset: 0;
  position: fixed;
  z-index: calc(${layout.zIndex.fixed} - 1);

  ${MOBILE} {
    display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  }
`;

/* ---------------------------------------------------------------- header */

export const HeaderWrapper = styled.div<StyledSidebarCollapsibleProps>`
  align-items: center;
  background: ${HEADER_BG};
  border-bottom: 1px solid ${BORDER};
  display: flex;
  flex-shrink: 0;
  gap: ${s('xs')};
  min-height: ${s('6xl')};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'space-between')};
  padding: ${s('sm')} ${({ $isCollapsed }) => ($isCollapsed ? s('xs') : s('sm'))};
`;

export const IdentitySection = styled.div<StyledSidebarCollapsibleProps>`
  align-items: center;
  display: flex;
  flex: 1;
  gap: ${s('xs')};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  min-width: 0;
  overflow: hidden;
`;

export const AvatarButton = styled.button`
  align-items: center;
  background: ${AVATAR_BG};
  border: none;
  border-radius: ${sh('full')};
  color: ${ACTIVE_FG};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-family: ${tf('display')};
  font-size: ${ts('sm')};
  font-weight: ${tw('bold')};
  height: ${s('xl')};
  justify-content: center;
  padding: 0;
  text-transform: uppercase;
  width: ${s('xl')};

  &:hover {
    opacity: 0.85;
  }

  /* Collapsing is a desktop affordance: on mobile the rail is a drawer, not a rail. */
  ${MOBILE} {
    cursor: default;
    pointer-events: none;

    &:hover {
      opacity: 1;
    }
  }
`;

export const IdentityColumn = styled.div<StyledSidebarCollapsibleProps>`
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

export const IdentityName = styled.span`
  color: ${ACTIVE_FG};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IdentityEmail = styled.span`
  color: ${FG_MUTED};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderBadge = styled.div<StyledSidebarCollapsibleProps>`
  align-items: center;
  background: ${HOVER_BG};
  border: 1px solid ${BORDER};
  border-radius: ${sh('full')};
  color: ${FG};
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-shrink: 0;
  font-family: ${tf('display')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  gap: ${s('micro')};
  padding: ${s('micro')} ${s('xs')};
`;

export const CloseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: ${sh('md')};
  color: ${FG_MUTED};
  cursor: pointer;
  display: none;
  flex-shrink: 0;
  height: ${s('lg')};
  justify-content: center;
  width: ${s('lg')};

  ${MOBILE} {
    display: flex;
  }

  &:hover {
    background-color: ${HOVER_BG};
    color: ${ACTIVE_FG};
  }
`;

/* ------------------------------------------------------------------- nav */

export const NavSection = styled.nav`
  flex: 1;
  min-height: 0;
  overflow: hidden auto;
  padding: ${s('md')} 0;

  &::-webkit-scrollbar {
    width: ${s('micro')};
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${HOVER_BG};
    border-radius: ${sh('full')};
  }
`;

export const NavList = styled.ul<StyledSidebarCollapsibleProps>`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  list-style: none;
  margin: 0;
  padding: 0 ${({ $isCollapsed }) => ($isCollapsed ? s('xs') : s('sm'))};
`;

export const NavItem = styled.li``;

export const NavTooltip = styled.span`
  background-color: ${c('neutral800')};
  border-radius: ${sh('sm')};
  box-shadow: ${el('md')};
  color: ${c('textInverse')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  left: calc(100% + ${s('xs')});
  opacity: 0;
  padding: ${s('xs')} ${s('sm')};
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity ${mo('fast')};
  visibility: hidden;
  white-space: nowrap;
  z-index: ${layout.zIndex.modal};
`;

export const NavItemWrapper = styled.div`
  position: relative;

  &:hover ${NavTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

export const NavLink = styled.a<StyledSidebarNavLinkProps>`
  align-items: center;
  background-color: ${({ $isActive }) => ($isActive ? ACTIVE_BG : 'transparent')};
  border-left: 3px solid ${({ $isActive }) => ($isActive ? ACTIVE_MARKER : 'transparent')};
  border-radius: ${sh('md')};
  color: ${({ $isActive }) => ($isActive ? ACTIVE_FG : FG)};
  cursor: pointer;
  display: flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  gap: ${s('xs')};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  padding: ${s('xs')} ${s('sm')};
  text-decoration: none;
  transition: ${mo('normal')};

  ${({ $isActive }) =>
    !$isActive &&
    css`
      &:hover {
        background-color: ${HOVER_BG};
        color: ${ACTIVE_FG};
      }
    `}
`;

export const NavIcon = styled.span`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: ${s('md')};
  justify-content: center;
  width: ${s('md')};
`;

export const NavLabel = styled.span<StyledSidebarCollapsibleProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* Removed from the a11y tree when collapsed: a 0-opacity label is still read aloud. */
  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      display: none;
    `}
`;

export const NavBadge = styled.span<StyledSidebarCollapsibleProps>`
  align-items: center;
  background-color: ${c('error')};
  border-radius: ${sh('full')};
  color: ${c('textInverse')};
  display: flex;
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  height: ${s('md')};
  justify-content: center;
  min-width: ${s('md')};
  padding: 0 ${s('xs')};

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      position: absolute;
      right: ${s('micro')};
      top: ${s('micro')};
    `}
`;

/* ---------------------------------------------------------------- footer */

export const FooterWrapper = styled.div<StyledSidebarCollapsibleProps>`
  border-top: 1px solid ${BORDER};
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${s('md')} ${({ $isCollapsed }) => ($isCollapsed ? s('xs') : s('sm'))};
`;

export const FooterButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 1px solid ${BORDER};
  border-radius: ${sh('md')};
  color: ${FG};
  cursor: pointer;
  display: flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  gap: ${s('xs')};
  justify-content: center;
  padding: ${s('xs')} ${s('sm')};
  transition: ${mo('normal')};
  width: 100%;

  &:hover {
    background-color: ${HOVER_BG};
    color: ${ACTIVE_FG};
  }
`;

export const FooterLabel = styled.span<StyledSidebarCollapsibleProps>`
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'inline')};
`;

/* ---------------------------------------------------------------- layout */

export const LayoutShell = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const LayoutContent = styled.div<StyledSidebarCollapsibleProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? WIDTH_COLLAPSED : WIDTH)};
  min-height: 100vh;
  min-width: 0;
  transition: margin-left ${mo('normal')};

  ${MOBILE} {
    margin-left: 0;
  }
`;

export const LayoutBody = styled.main`
  flex: 1;
  padding: ${s('xl')} ${s('lg')};
`;
