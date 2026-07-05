import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useNotifications } from './useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('queues and removes notifications', () => {
    const { result } = renderHook(() => useNotifications({ autoDismissMs: 0 }));

    let id = '';
    act(() => {
      id = result.current.notify({ message: 'Saved', type: 'success' });
    });
    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.remove(id);
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('auto-dismisses after the configured timeout', () => {
    const { result } = renderHook(() => useNotifications({ autoDismissMs: 1000 }));

    act(() => {
      result.current.notify({ message: 'Bye soon' });
    });
    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('caps the queue at max', () => {
    const { result } = renderHook(() => useNotifications({ autoDismissMs: 0, max: 2 }));

    act(() => {
      result.current.notify({ message: 'one' });
      result.current.notify({ message: 'two' });
      result.current.notify({ message: 'three' });
    });
    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0]?.message).toBe('two');
  });

  it('clears the whole queue', () => {
    const { result } = renderHook(() => useNotifications({ autoDismissMs: 0 }));

    act(() => {
      result.current.notify({ message: 'a' });
      result.current.notify({ message: 'b' });
      result.current.clear();
    });
    expect(result.current.notifications).toHaveLength(0);
  });
});
