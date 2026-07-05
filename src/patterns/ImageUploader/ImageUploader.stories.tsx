/**
 * ImageUploader Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ImageUploader } from './ImageUploader';

const meta: Meta<typeof ImageUploader> = {
  component: ImageUploader,
  tags: ['autodocs'],
  title: 'Patterns/ImageUploader',
};

export default meta;
type Story = StoryObj<typeof ImageUploader>;

export const Empty: Story = {
  args: {
    id: 'cover',
    label: 'Cover image',
    onFileSelect: () => {},
    placeholder: 'Click to upload a cover image',
  },
};

const SimulatedUploadDemo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File, preview: string) => {
    void file;
    setIsUploading(true);
    setTimeout(() => {
      setImageUrl(preview);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <ImageUploader
      currentImageUrl={imageUrl}
      isUploading={isUploading}
      label='Cover image'
      onFileSelect={handleFileSelect}
    />
  );
};

export const SimulatedUpload: Story = {
  render: () => <SimulatedUploadDemo />,
};
