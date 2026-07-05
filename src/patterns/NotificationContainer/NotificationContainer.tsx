/**
 * NotificationContainer Pattern
 *
 * Renders a toast queue (from useNotifications or any compatible state) as a
 * fixed stack of NotificationToast components anchored to a screen corner.
 */

import { useCallback } from 'react';

import type { NotificationContainerProps } from './NotificationContainer.interfaces';
import { NotificationToast } from '../../components/NotificationToast';

import { Container } from './NotificationContainer.styled';

export const NotificationContainer = ({
  notifications,
  onClose,
  position = 'top-right',
}: NotificationContainerProps) => {
  const handleClose = useCallback((id: string) => () => onClose(id), [onClose]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Container $position={position} aria-live='polite' role='status'>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={handleClose(notification.id)}
        />
      ))}
    </Container>
  );
};
