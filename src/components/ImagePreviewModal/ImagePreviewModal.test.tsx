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

  it('plays a video with controls instead of an image', () => {
    render(
      <ImagePreviewModal
        imageUrl='/clip.mp4'
        isOpen
        mediaType='video'
        title='Clip'
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByAltText('Clip')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Clip')).toHaveAttribute('controls');
  });

  it('navigates with the arrows and with the arrow keys', async () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const user = userEvent.setup();
    render(
      <ImagePreviewModal
        imageUrl='/img.png'
        isOpen
        nextLabel='Siguiente'
        previousLabel='Anterior'
        title='Photo'
        onClose={vi.fn()}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    await user.keyboard('{ArrowRight}{ArrowLeft}');
    expect(onNext).toHaveBeenCalledTimes(2);
    expect(onPrevious).toHaveBeenCalledTimes(2);
  });

  it('shows no arrows and no download without their callbacks', () => {
    render(<ImagePreviewModal imageUrl='/img.png' isOpen title='Photo' onClose={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('offers a download button only when asked', async () => {
    const onDownload = vi.fn();
    const user = userEvent.setup();
    render(
      <ImagePreviewModal
        downloadLabel='Descargar'
        imageUrl='/img.png'
        isOpen
        title='Photo'
        onClose={vi.fn()}
        onDownload={onDownload}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Descargar' }));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
