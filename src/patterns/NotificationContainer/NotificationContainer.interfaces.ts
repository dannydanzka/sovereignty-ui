/**
 * NotificationContainer Pattern Interfaces
 */

import type { QueuedNotification } from '../../hooks/useNotifications.interfaces';

export type NotificationPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export interface NotificationContainerProps {
  /**
   * Closes each toast after this many milliseconds (or its own `displayDuration`). Off by default:
   * `useNotifications` keeps its own timers. Turn it on when the queue lives in an app store,
   * where nothing else would ever dismiss a toast.
   */
  autoDismissMs?: number;
  notifications: QueuedNotification[];
  onClose: (id: string) => void;
  position?: NotificationPosition;
}

export interface StyledNotificationStackProps {
  $position: NotificationPosition;
}
