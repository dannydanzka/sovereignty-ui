import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AvatarUpload } from './AvatarUpload';

describe('AvatarUpload', () => {
  it('shows initials when there is no photo', () => {
    render(<AvatarUpload initials='JD' name='Jane Doe' onFileSelect={vi.fn()} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows the current photo when provided', () => {
    render(
      <AvatarUpload
        currentPhotoUrl='/photo.jpg'
        initials='JD'
        name='Jane Doe'
        onFileSelect={vi.fn()}
      />
    );
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
  });

  it('hands the selected file and a preview to onFileSelect', async () => {
    const onFileSelect = vi.fn();
    const user = userEvent.setup();
    render(<AvatarUpload changeLabel='Change photo' initials='JD' onFileSelect={onFileSelect} />);

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const hiddenInput = screen.getByTestId('avatar-upload-input');

    await user.upload(hiddenInput, file);
    await waitFor(() => expect(onFileSelect).toHaveBeenCalledTimes(1));
    const [selectedFile, preview] = onFileSelect.mock.calls[0] as [File, string];
    expect(selectedFile.name).toBe('avatar.png');
    expect(preview).toContain('data:image/png');
  });
});
