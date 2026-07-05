/**
 * useNotifications Hook
 *
 * Local toast queue manager: push notifications, auto-dismiss after a
 * timeout, cap the visible queue. Pair with the NotificationContainer
 * pattern to render the queue — no global state library required.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  NotifyInput,
  QueuedNotification,
  UseNotificationsOptions,
  UseNotificationsResult,
} from './useNotifications.interfaces';

const DEFAULT_AUTO_DISMISS_MS = 5000;
const DEFAULT_MAX = 5;

export const useNotifications = ({
  autoDismissMs = DEFAULT_AUTO_DISMISS_MS,
  max = DEFAULT_MAX,
}: UseNotificationsOptions = {}): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<QueuedNotification[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    ({ message, title, type = 'info' }: NotifyInput): string => {
      counterRef.current += 1;
      const id = `sui-notification-${counterRef.current}`;

      setNotifications((prev) => {
        const next = [...prev, { id, message, title, type }];
        return next.length > max ? next.slice(next.length - max) : next;
      });

      if (autoDismissMs > 0) {
        const timer = setTimeout(() => remove(id), autoDismissMs);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [autoDismissMs, max, remove]
  );

  const clear = useCallback(() => {
    setNotifications([]);
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { clear, notifications, notify, remove };
};
