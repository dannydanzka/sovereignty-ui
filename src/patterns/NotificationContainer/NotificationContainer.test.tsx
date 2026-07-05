import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
