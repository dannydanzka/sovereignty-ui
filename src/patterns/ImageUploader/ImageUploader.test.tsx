import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImageUploader } from './ImageUploader';

describe('ImageUploader', () => {
  it('renders label and placeholder without image', () => {
    render(
      <ImageUploader
        id='cover'
        label='Cover image'
        placeholder='Upload a cover'
        onFileSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Cover image')).toBeInTheDocument();
    expect(screen.getByText('Upload a cover')).toBeInTheDocument();
  });

  it('shows the current image when provided', () => {
    render(<ImageUploader currentImageUrl='/cover.jpg' label='Cover' onFileSelect={vi.fn()} />);
    expect(screen.getByAltText('Cover')).toBeInTheDocument();
  });

  it('hands the selected file and preview to onFileSelect', async () => {
    const onFileSelect = vi.fn();
    const user = userEvent.setup();
    render(<ImageUploader onFileSelect={onFileSelect} />);

    const file = new File(['img'], 'cover.png', { type: 'image/png' });
    await user.upload(screen.getByTestId('image-uploader-input'), file);

    await waitFor(() => expect(onFileSelect).toHaveBeenCalledTimes(1));
    const [selectedFile, preview] = onFileSelect.mock.calls[0] as [File, string];
    expect(selectedFile.name).toBe('cover.png');
    expect(preview).toContain('data:image/png');
  });
});
