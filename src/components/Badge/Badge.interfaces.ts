/**
 * Badge Component Interfaces
 */

import type { ReactNode } from 'react';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeVariant =
  | 'danger'
  | 'default'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export interface StyledBadgeProps {
  $size?: BadgeSize;
  $variant: BadgeVariant;
}
