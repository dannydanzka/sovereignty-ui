/**
 * FloatingActions Pattern Interfaces
 */

import type { ReactNode } from 'react';

export type FloatingActionsSide = 'left' | 'right';

export interface FloatingActionItem {
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export interface FloatingActionsProps {
  animated?: boolean;
  className?: string;
  items: FloatingActionItem[];
  side?: FloatingActionsSide;
}

export interface StyledFloatingContainerProps {
  $side: FloatingActionsSide;
}

export interface StyledFloatingButtonProps {
  $animated: boolean;
  $delay: number;
}
