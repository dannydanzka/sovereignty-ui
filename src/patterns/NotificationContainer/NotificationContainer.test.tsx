import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { NotificationContainer } from './NotificationContainer';

const NOTIFICATIONS = [
  { id: '1', message: 'Saved successfully', title: 'Done', type: 'success' as const },
  { id: '2', message: 'Something failed', type: 'error' as const },
];

describe('NotificationContainer', () => {
  it('renders nothing for an empty queue', () => {
    render(<NotificationContainer notifications={[]} onClose={vi.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders every queued notification', () => {
    render(<NotificationContainer notifications={NOTIFICATIONS} onClose={vi.fn()} />);
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('reports the closed notification id', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<NotificationContainer notifications={NOTIFICATIONS} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button');
    const [firstButton] = closeButtons;
    expect(firstButton).toBeDefined();
    if (firstButton) {
      await user.click(firstButton);
    }
    expect(onClose).toHaveBeenCalledWith('1');
  });

  describe('auto-dismiss', () => {
    it('closes nothing on its own by default', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      render(<NotificationContainer notifications={NOTIFICATIONS} onClose={onClose} />);

      act(() => {
        vi.advanceTimersByTime(60_000);
      });

      expect(onClose).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('closes each toast after the container delay or its own displayDuration', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      const queue = [
        { id: 'a', message: 'Guardado', type: 'success' as const },
        { displayDuration: 1000, id: 'b', message: 'Rápido', type: 'info' as const },
      ];
      render(
        <NotificationContainer autoDismissMs={5000} notifications={queue} onClose={onClose} />
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledWith('b');
      expect(onClose).not.toHaveBeenCalledWith('a');

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(onClose).toHaveBeenCalledWith('a');
      vi.useRealTimers();
    });

    it('drops the timer of a toast that left the queue, and never re-arms a running one', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      const first = [{ id: 'a', message: 'Uno', type: 'info' as const }];
      const { rerender, unmount } = render(
        <NotificationContainer autoDismissMs={3000} notifications={first} onClose={onClose} />
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      rerender(
        <NotificationContainer autoDismissMs={3000} notifications={[...first]} onClose={onClose} />
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);

      const second = [{ id: 'b', message: 'Dos', type: 'info' as const }];
      rerender(
        <NotificationContainer autoDismissMs={3000} notifications={second} onClose={onClose} />
      );
      rerender(<NotificationContainer autoDismissMs={3000} notifications={[]} onClose={onClose} />);
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);

      rerender(
        <NotificationContainer autoDismissMs={3000} notifications={second} onClose={onClose} />
      );
      unmount();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });
});
