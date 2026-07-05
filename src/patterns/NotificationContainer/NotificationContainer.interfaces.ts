/**
 * NotificationContainer Pattern Interfaces
 */

import type { QueuedNotification } from '../../hooks/useNotifications.interfaces';

export type NotificationPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export interface NotificationContainerProps {
  notifications: QueuedNotification[];
  onClose: (id: string) => void;
  position?: NotificationPosition;
}

export interface StyledNotificationStackProps {
  $position: NotificationPosition;
}
