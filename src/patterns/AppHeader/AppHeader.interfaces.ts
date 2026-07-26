/**
 * AppHeader Pattern Interfaces
 */

import type { ReactNode } from 'react';

export type AppHeaderBreakpoint = 'lg' | 'md';

export interface AppHeaderProps {
  /**
   * Hide the actions slot below the collapse breakpoint. Defaults to `true` (the pattern's original
   * behaviour); pass `false` when the slot holds something that must stay reachable on a phone,
   * like a cart icon.
   */
  actionsCollapse?: boolean;
  actionsSlot?: ReactNode;
  className?: string;
  closeMenuLabel?: string;
  /** Below this breakpoint the desktop nav collapses into the mobile panel. */
  collapseAt?: AppHeaderBreakpoint;
  /**
   * Overlay whatever follows (a full-bleed hero) instead of taking space in the flow —
   * `position: fixed` rather than `sticky`.
   */
  floating?: boolean;
  /** Slide out of view: the hide-on-scroll-down half of `useHeaderScroll`. */
  hidden?: boolean;
  logoSlot: ReactNode;
  mobileMenuContent?: ReactNode;
  navSlot?: ReactNode;
  /**
   * Fires whenever the mobile panel opens or closes. A header over a hero normally has to turn
   * solid while the panel is open, and the panel's state lives here — so the consumer has to be
   * told about it.
   */
  onMenuToggle?: (isOpen: boolean) => void;
  openMenuLabel?: string;
  sticky?: boolean;
  /**
   * No background, border or shadow: the header sits over dark imagery. It switches its own `color`
   * to the on-dark token and slot content inherits it — so a consumer does NOT thread an `isOnDark`
   * flag through every link, icon and badge it puts in the slots.
   */
  transparent?: boolean;
}

export interface StyledHeaderProps {
  $collapseAt: AppHeaderBreakpoint;
  $floating: boolean;
  $hidden: boolean;
  $sticky: boolean;
  $transparent: boolean;
}

export interface StyledHeaderSlotProps {
  $collapseAt: AppHeaderBreakpoint;
}

export interface StyledActionsSlotProps extends StyledHeaderSlotProps {
  $collapse: boolean;
}

export interface StyledMobileMenuProps {
  $collapseAt: AppHeaderBreakpoint;
  $isOpen: boolean;
}
