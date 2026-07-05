/**
 * ActionButton Component Interfaces
 */

import type { ReactNode } from 'react';

export type ActionButtonVariant = 'delete' | 'edit' | 'neutral' | 'view';
export type ActionButtonSize = 'md' | 'sm';

export interface ActionButtonProps {
  className?: string;
  disabled?: boolean;
  icon: ReactNode;
  isLoading?: boolean;
  onClick: () => void;
  size?: ActionButtonSize;
  title: string;
  variant?: ActionButtonVariant;
}

export interface StyledActionButtonProps {
  $isLoading: boolean;
  $size: ActionButtonSize;
  $variant: ActionButtonVariant;
}
