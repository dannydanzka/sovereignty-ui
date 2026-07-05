/**
 * useNotifications Hook Interfaces
 */

import type { NotificationType } from '../components/NotificationToast';

export interface QueuedNotification {
  id: string;
  message: string;
  title?: string;
  type: NotificationType;
}

export interface NotifyInput {
  message: string;
  title?: string;
  type?: NotificationType;
}

export interface UseNotificationsOptions {
  autoDismissMs?: number;
  max?: number;
}

export interface UseNotificationsResult {
  clear: () => void;
  notifications: QueuedNotification[];
  notify: (input: NotifyInput) => string;
  remove: (id: string) => void;
}
