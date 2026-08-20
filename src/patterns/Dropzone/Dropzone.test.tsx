/**
 * The two cases that motivated this component are pinned here: a **drop is filtered by `accept`**
 * (the browser only applies the attribute to the file picker), and a rejected file is never
 * reported through `onFiles` — silently passing a 40 MB PDF into an image field is worse than
 * refusing it. Copy is asserted through the injected `texts`, because the component has none of
 * its own.
 */

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dropzone } from './Dropzone';
import type { DropzoneTexts } from './Dropzone.interfaces';

const TEXTS: DropzoneTexts = {
  browse: 'Choose files',
  placeholder: 'Drop files here',
  tooBig: (name, maxSizeMB) => `${name} is over ${maxSizeMB} MB`,
  tooMany: (maxFiles) => `At most ${maxFiles} files`,
  wrongType: (name) => `${name} is not an accepted type`,
};

const makeFile = (name: string, type: string, sizeMB = 1): File => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeMB * 1024 * 1024 });
  return file;
};

const IMAGE = makeFile('photo.jpg', 'image/jpeg');
const PDF = makeFile('sheet.pdf', 'application/pdf');

const drop = (files: File[]) =>
  fireEvent.drop(screen.getByTestId('dropzone'), { dataTransfer: { files } });

const setup = (props: Partial<Parameters<typeof Dropzone>[0]> = {}) => {
  const onFiles = vi.fn();
  render(<Dropzone accept='image/*' texts={TEXTS} onFiles={onFiles} {...props} />);
  return { onFiles, user: userEvent.setup() };
};

describe('Dropzone', () => {
  it('renders the injected placeholder', () => {
    setup();
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('hands a dropped file to the caller', () => {
    const { onFiles } = setup();
    drop([IMAGE]);
    expect(onFiles).toHaveBeenCalledWith([IMAGE]);
  });

  it('refuses a dropped file whose type the field does not accept', () => {
    const { onFiles } = setup();
    drop([PDF]);
    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByText('sheet.pdf is not an accepted type')).toBeInTheDocument();
  });

  it('refuses a file over the size cap, naming the cap', () => {
    const { onFiles } = setup({ maxSizeMB: 5 });
    drop([makeFile('big.jpg', 'image/jpeg', 9)]);
    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByText('big.jpg is over 5 MB')).toBeInTheDocument();
  });

  it('refuses more files than the field admits', () => {
    const { onFiles } = setup({ maxFiles: 2 });
    drop([IMAGE, makeFile('b.jpg', 'image/jpeg'), makeFile('c.jpg', 'image/jpeg')]);
    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByText('At most 2 files')).toBeInTheDocument();
  });

  it('clears a previous rejection once an accepted file arrives', () => {
    const { onFiles } = setup();
    drop([PDF]);
    drop([IMAGE]);
    expect(onFiles).toHaveBeenCalledWith([IMAGE]);
    expect(screen.queryByText('sheet.pdf is not an accepted type')).not.toBeInTheDocument();
  });

  /** One slot for refusals: the field's own error must not appear somewhere else on the screen. */
  it('shows an error the field decided, and lets its own rejection win over it', () => {
    setup({ error: 'Upload failed' });
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
    drop([PDF]);
    expect(screen.getByText('sheet.pdf is not an accepted type')).toBeInTheDocument();
    expect(screen.queryByText('Upload failed')).not.toBeInTheDocument();
  });

  it('ignores a drop while disabled', () => {
    const { onFiles } = setup({ disabled: true });
    drop([IMAGE]);
    expect(onFiles).not.toHaveBeenCalled();
  });

  /** Without this the browser navigates away to the dropped file and the form is lost. */
  it('prevents the browser default on dragover and on drop', () => {
    setup();
    const zone = screen.getByTestId('dropzone');
    expect(fireEvent.dragOver(zone, { dataTransfer: { files: [] } })).toBe(false);
    expect(fireEvent.drop(zone, { dataTransfer: { files: [IMAGE] } })).toBe(false);
  });

  it('opens the file picker when the zone is activated', async () => {
    const { user } = setup();
    const input = screen.getByLabelText('Choose files');
    const click = vi.spyOn(input, 'click');
    await user.click(screen.getByRole('button', { name: /Drop files here/ }));
    expect(click).toHaveBeenCalled();
  });
});
