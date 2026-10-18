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

const PHOTOS = ['https://picsum.photos/id/10/900/600', 'https://picsum.photos/id/20/900/600'];

const GalleryDemo = () => {
  const [index, setIndex] = useState<number | null>(null);
  const step = (delta: number) => () =>
    setIndex((current) =>
      current === null ? null : (current + delta + PHOTOS.length) % PHOTOS.length
    );

  return (
    <div>
      <Button onClick={() => setIndex(0)}>Open gallery</Button>
      <ImagePreviewModal
        imageUrl={index === null ? '' : (PHOTOS[index] ?? '')}
        isOpen={index !== null}
        title={`Photo ${String((index ?? 0) + 1)}`}
        onClose={() => setIndex(null)}
        onDownload={() => undefined}
        onNext={step(1)}
        onPrevious={step(-1)}
      />
    </div>
  );
};

export const WithNavigationAndDownload: Story = {
  render: () => <GalleryDemo />,
};

const VideoDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open video</Button>
      <ImagePreviewModal
        imageUrl='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        isOpen={isOpen}
        mediaType='video'
        title='Sample video'
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export const Video: Story = {
  render: () => <VideoDemo />,
};
