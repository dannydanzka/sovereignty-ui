/**
 * Button Component Interfaces
 *
 * Unified button component supporting all admin variants:
 * - CancelButton, SaveButton, ConfirmButton, CreateButton
 * - IconButton, CloseButton
 */

import type { MouseEvent, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'brand'
  | 'brand-outline'
  | 'brand-ghost';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export type ButtonShape = 'square' | 'circle' | 'pill';

export interface ButtonProps {
  'aria-label'?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingIcon?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
  shape?: ButtonShape;
  size?: ButtonSize;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

export interface StyledButtonProps {
  $fullWidth?: boolean;
  $iconOnly?: boolean;
  $shape?: ButtonShape;
  $size: ButtonSize;
  $variant: ButtonVariant;
}
