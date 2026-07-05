import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImagePreviewModal } from './ImagePreviewModal';

describe('ImagePreviewModal', () => {
  it('renders nothing when closed', () => {
    render(
      <ImagePreviewModal imageUrl='/img.png' isOpen={false} title='Photo' onClose={vi.fn()} />
    );
    expect(screen.queryByAltText('Photo')).not.toBeInTheDocument();
  });

  it('renders image, title, badge slot, and description when open', () => {
    render(
      <ImagePreviewModal
        badge={<span data-testid='badge'>Nature</span>}
        description='A quiet forest'
        imageUrl='/img.png'
        isOpen
        title='Photo'
        onClose={vi.fn()}
      />
    );
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('A quiet forest')).toBeInTheDocument();
  });

  it('calls onClose from the close button with custom label', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ImagePreviewModal
        closeLabel='Cerrar'
        imageUrl='/img.png'
        isOpen
        title='Photo'
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ImagePreviewModal imageUrl='/img.png' isOpen title='Photo' onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
