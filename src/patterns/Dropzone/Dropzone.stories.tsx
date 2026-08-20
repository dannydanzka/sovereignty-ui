/**
 * Dropzone Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Dropzone } from './Dropzone';
import type { DropzoneTexts } from './Dropzone.interfaces';

const demoTexts: DropzoneTexts = {
  browse: 'Choose files',
  placeholder: 'Drag files here or click to choose them',
  tooBig: (name, maxSizeMB) => `"${name}" is over the ${maxSizeMB} MB limit.`,
  tooMany: (maxFiles) => `At most ${maxFiles} files at a time.`,
  wrongType: (name) => `"${name}" is not an accepted file type.`,
};

const meta: Meta<typeof Dropzone> = {
  component: Dropzone,
  tags: ['autodocs'],
  title: 'Patterns/Dropzone',
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    onFiles: () => {},
    texts: demoTexts,
  },
};

export const ImagesOnlyWithHint: Story = {
  args: {
    accept: 'image/*',
    hint: 'JPG, PNG or WebP up to 5 MB',
    maxFiles: 6,
    maxSizeMB: 5,
    onFiles: () => {},
    texts: demoTexts,
  },
};

export const WithFieldError: Story = {
  args: {
    error: 'The upload failed — try again.',
    onFiles: () => {},
    texts: demoTexts,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onFiles: () => {},
    texts: demoTexts,
  },
};
