import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotificationToast } from './NotificationToast';

describe('NotificationToast', () => {
  it('renders message', () => {
    render(<NotificationToast notification={{ id: '1', message: 'Saved', type: 'success' }} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <NotificationToast
        notification={{ id: '1', message: 'Details', title: 'Error', type: 'error' }}
      />
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const handleClose = vi.fn();
    render(
      <NotificationToast
        notification={{ id: '1', message: 'Msg', type: 'info' }}
        onClose={handleClose}
      />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
