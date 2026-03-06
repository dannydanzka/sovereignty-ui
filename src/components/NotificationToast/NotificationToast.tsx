/**
 * NotificationToast
 *
 * Toast notification with type-based icon and color.
 */

import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

import type { NotificationToastProps } from './NotificationToast.interfaces';

import {
  ToastCloseButton,
  ToastContainer,
  ToastContent,
  ToastIcon,
  ToastMessage,
  ToastTitle,
} from './NotificationToast.styled';

const DEFAULT_NOTIFICATION = { id: '', message: '', type: 'info' as const };

export const NotificationToast = ({
  notification = DEFAULT_NOTIFICATION,
  onClose = () => {},
}: NotificationToastProps) => {
  const safeNotification = notification || DEFAULT_NOTIFICATION;

  const getIcon = () => {
    switch (safeNotification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'error':
      default:
        return <XCircle size={20} />;
    }
  };

  return (
    <ToastContainer $type={safeNotification.type}>
      <ToastIcon $type={safeNotification.type}>{getIcon()}</ToastIcon>
      <ToastContent>
        {safeNotification.title && <ToastTitle>{safeNotification.title}</ToastTitle>}
        <ToastMessage>{safeNotification.message}</ToastMessage>
      </ToastContent>
      <ToastCloseButton type='button' onClick={onClose}>
        <X size={16} />
      </ToastCloseButton>
    </ToastContainer>
  );
};
