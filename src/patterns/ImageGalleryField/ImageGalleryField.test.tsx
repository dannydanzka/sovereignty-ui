/**
 * What is asserted here is the **array that leaves the field**, not the pixels. Every bug this field
 * exists to close is an array bug: an append-only value means an inherited image can never be taken
 * out, and the first URL — the thumbnail wherever the consumer shows the record — could never change
 * without deleting the rest.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImageGalleryField } from './ImageGalleryField';
import type { ImageGalleryFieldTexts } from './ImageGalleryField.interfaces';

const TEXTS: ImageGalleryFieldTexts = {
  browse: 'Choose files',
  capHint: (max) => `Up to ${max} images.`,
  makePrimary: (position) => `Make image ${position} primary`,
  placeholder: 'Drag images here',
  primary: 'Primary',
  remove: (position) => `Remove image ${position}`,
  tooBig: (name, mb) => `${name} is over ${mb} MB`,
  tooMany: (max) => `At most ${max} files`,
  uploadError: 'The upload failed.',
  uploading: 'Uploading…',
  wrongType: (name) => `${name} is not an accepted type`,
};

const IMAGES = [
  'https://cdn.example.test/front.jpg',
  'https://cdn.example.test/side.jpg',
  'https://cdn.example.test/detail.jpg',
];

const setup = (value: string[] = IMAGES) => {
  const onChange = vi.fn();
  render(
    <ImageGalleryField
      label='Record images'
      texts={TEXTS}
      upload={vi.fn()}
      value={value}
      onChange={onChange}
    />
  );
  return { onChange, user: userEvent.setup() };
};

describe('ImageGalleryField', () => {
  it('shows one thumbnail per image', () => {
    setup();
    expect(screen.getByRole('img', { name: /Record images 1/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Record images 3/ })).toBeInTheDocument();
  });

  it('marks the first image as the one used as the thumbnail', () => {
    setup();
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('removes only the image asked for, and keeps the order of the rest', async () => {
    const { onChange, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Remove image 2' }));
    expect(onChange).toHaveBeenCalledWith([IMAGES[0], IMAGES[2]]);
  });

  /**
   * "Set primary" is a MOVE, not a swap: swapping would send the old primary to position 2 and
   * silently reshuffle the gallery the user just ordered.
   */
  it('promotes an image to primary by moving it to the front', async () => {
    const { onChange, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Make image 3 primary' }));
    expect(onChange).toHaveBeenCalledWith([IMAGES[2], IMAGES[0], IMAGES[1]]);
  });

  it('offers no primary action on the image that already is primary', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Make image 2 primary' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Make image 1 primary' })).not.toBeInTheDocument();
  });

  it('renders nothing but the uploader when there are no images', () => {
    setup([]);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('offers no way to type a URL — a file is the only source', () => {
    setup();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows the injected error copy when the upload rejects', async () => {
    const onChange = vi.fn();
    const upload = vi.fn().mockRejectedValue(new Error('boom'));
    render(
      <ImageGalleryField
        label='Record images'
        texts={TEXTS}
        upload={upload}
        value={[]}
        onChange={onChange}
      />
    );
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Choose files');
    await userEvent.setup().upload(input, file);
    expect(await screen.findByText('The upload failed.')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
