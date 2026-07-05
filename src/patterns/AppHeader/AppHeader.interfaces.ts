/**
 * AppHeader Pattern Interfaces
 */

import type { ReactNode } from 'react';

export interface AppHeaderProps {
  actionsSlot?: ReactNode;
  className?: string;
  closeMenuLabel?: string;
  logoSlot: ReactNode;
  mobileMenuContent?: ReactNode;
  navSlot?: ReactNode;
  openMenuLabel?: string;
  sticky?: boolean;
}

export interface StyledHeaderProps {
  $sticky: boolean;
}

export interface StyledMobileMenuProps {
  $isOpen: boolean;
}
