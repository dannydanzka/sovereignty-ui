/**
 * ImageGalleryField Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ImageGalleryField } from './ImageGalleryField';
import type { ImageGalleryFieldTexts } from './ImageGalleryField.interfaces';

const demoTexts: ImageGalleryFieldTexts = {
  browse: 'Choose files',
  capHint: (max) => `Up to ${max} images.`,
  makePrimary: (position) => `Make image ${position} primary`,
  placeholder: 'Drag images here or click to choose them',
  primary: 'Primary',
  remove: (position) => `Remove image ${position}`,
  tooBig: (name, mb) => `"${name}" is over the ${mb} MB limit.`,
  tooMany: (max) => `At most ${max} files at a time.`,
  uploadError: 'The upload failed — try again.',
  uploading: 'Uploading…',
  wrongType: (name) => `"${name}" is not an accepted file type.`,
};

const meta: Meta<typeof ImageGalleryField> = {
  component: ImageGalleryField,
  tags: ['autodocs'],
  title: 'Patterns/ImageGalleryField',
};

export default meta;
type Story = StoryObj<typeof ImageGalleryField>;

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });

const GalleryDemo = () => {
  const [urls, setUrls] = useState<string[]>([
    'https://picsum.photos/seed/one/400/300',
    'https://picsum.photos/seed/two/400/300',
    'https://picsum.photos/seed/three/400/300',
  ]);

  return (
    <ImageGalleryField
      label='Record images'
      texts={demoTexts}
      upload={readAsDataUrl}
      value={urls}
      onChange={setUrls}
    />
  );
};

export const Default: Story = {
  render: () => <GalleryDemo />,
};
