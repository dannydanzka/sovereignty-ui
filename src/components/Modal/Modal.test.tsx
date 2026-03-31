import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when not open', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    render(<Modal isOpen title='Test Modal' onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Modal body</p>
      </Modal>
    );
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders confirm variant with message', () => {
    render(
      <Modal
        confirmText='Delete'
        isOpen
        message='Are you sure?'
        title='Confirm'
        variant='confirm'
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', async () => {
    const handleConfirm = vi.fn();
    render(<Modal isOpen variant='confirm' onClose={vi.fn()} onConfirm={handleConfirm} />);
    await userEvent.click(screen.getByText('Confirm'));
    expect(handleConfirm).toHaveBeenCalledOnce();
  });

  it('closes on Escape key', async () => {
    const handleClose = vi.fn();
    render(<Modal isOpen title='Test' onClose={handleClose} />);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(handleClose).toHaveBeenCalled());
  });
});
