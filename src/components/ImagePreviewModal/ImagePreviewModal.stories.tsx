/**
 * ImagePreviewModal Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge';
import { Button } from '../Button';
import { ImagePreviewModal } from './ImagePreviewModal';

const meta: Meta<typeof ImagePreviewModal> = {
  component: ImagePreviewModal,
  tags: ['autodocs'],
  title: 'Components/ImagePreviewModal',
};

export default meta;
type Story = StoryObj<typeof ImagePreviewModal>;

const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open preview</Button>
      <ImagePreviewModal
        badge={<Badge variant='info'>Gallery</Badge>}
        description='Sample image rendered from a placeholder service.'
        imageUrl='https://picsum.photos/900/600'
        isOpen={isOpen}
        title='Sample photo'
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
