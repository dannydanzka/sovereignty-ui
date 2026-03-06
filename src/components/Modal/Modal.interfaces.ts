/**
 * Modal Component Interfaces
 *
 * Unified modal supporting:
 * - Standard modal with custom content (variant: 'default')
 * - Confirmation modal with icon, message, and action buttons (variant: 'confirm')
 */

import type { ReactNode } from 'react';

export type ModalSize = 'full' | 'large' | 'lg' | 'md' | 'medium' | 'sm' | 'small' | 'xl';
export type ModalVariant = 'confirm' | 'default';
export type ConfirmVariant = 'danger' | 'info' | 'success' | 'warning';

export interface ModalProps {
  cancelText?: string;
  children?: ReactNode;
  closeLabel?: string;
  confirmText?: string;
  confirmVariant?: ConfirmVariant;
  disableClose?: boolean;
  footer?: ReactNode;
  icon?: ReactNode;
  isOpen: boolean;
  loading?: boolean;
  message?: string;
  noPadding?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  onConfirm?: () => void;
  size?: ModalSize;
  title?: string;
  variant?: ModalVariant;
}

export interface StyledModalContainerProps {
  $isClosing: boolean;
  $size: 'full' | 'lg' | 'md' | 'sm' | 'xl';
}

export interface StyledModalOverlayProps {
  $isClosing: boolean;
}

export interface StyledModalIconProps {
  $variant: ConfirmVariant;
}
