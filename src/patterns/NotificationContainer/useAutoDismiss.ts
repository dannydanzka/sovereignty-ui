/**
 * One timer per visible toast, owned by the always-mounted container: a timer in the screen that
 * raised the toast dies when the person navigates away, and a toast pushed straight into a store
 * has no screen at all.
 */

import { useEffect, useRef } from 'react';

import type { QueuedNotification } from '../../hooks/useNotifications.interfaces';

export const useAutoDismiss = (
  notifications: QueuedNotification[],
  onClose: (id: string) => void,
  autoDismissMs: number | undefined
): void => {
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const live = new Set(notifications.map((notification) => notification.id));

    notifications.forEach(({ displayDuration, id }) => {
      const delay = displayDuration ?? autoDismissMs;
      if (delay === undefined || delay <= 0 || timers.current.has(id)) return;
      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id);
          onClose(id);
        }, delay)
      );
    });

    timers.current.forEach((timer, id) => {
      if (!live.has(id)) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
    });
  }, [autoDismissMs, notifications, onClose]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);
};
