/**
 * NotificationToast Interfaces
 */

export type NotificationType = 'error' | 'info' | 'success' | 'warning';

export interface ToastNotification {
  id: string;
  message: string;
  title?: string;
  type: NotificationType;
}

export interface NotificationToastProps {
  notification?: ToastNotification;
  onClose?: () => void;
}

export interface StyledContainerProps {
  $isClosing?: boolean;
  $type: NotificationType;
}

export interface StyledIconProps {
  $type: NotificationType;
}
