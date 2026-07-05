/**
 * AvatarUpload Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { AvatarUpload } from './AvatarUpload';

const meta: Meta<typeof AvatarUpload> = {
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  component: AvatarUpload,
  tags: ['autodocs'],
  title: 'Patterns/AvatarUpload',
};

export default meta;
type Story = StoryObj<typeof AvatarUpload>;

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    name: 'Jane Doe',
    onFileSelect: () => {},
  },
};

const SimulatedUploadDemo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File, preview: string) => {
    void file;
    setIsUploading(true);
    setTimeout(() => {
      setPhotoUrl(preview);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <AvatarUpload
      currentPhotoUrl={photoUrl}
      initials='JD'
      isUploading={isUploading}
      name='Jane Doe'
      size='large'
      onFileSelect={handleFileSelect}
    />
  );
};

export const SimulatedUpload: Story = {
  render: () => <SimulatedUploadDemo />,
};
