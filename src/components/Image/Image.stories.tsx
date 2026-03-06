/**
 * Image Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Image } from './Image';

const meta = {
  argTypes: {
    loading: { control: 'radio', options: ['lazy', 'eager'] },
    objectFit: { control: 'radio', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
  },
  component: Image,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/Image',
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { alt: 'Sample', height: 120, width: 180 },
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '4px' }}>With src</p>
        <Image alt='Sample' height={120} src='https://picsum.photos/180/120' width={180} />
      </div>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '4px' }}>No src (fallback)</p>
        <Image alt='No image' fallbackText='No image' height={120} width={180} />
      </div>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '4px' }}>Broken src (fallback)</p>
        <Image alt='Broken' height={120} src='https://invalid.url/image.jpg' width={180} />
      </div>
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    alt: 'Sample photo',
    height: 200,
    src: 'https://picsum.photos/300/200',
    width: 300,
  },
};

export const Fallback: Story = {
  args: { alt: 'Missing image', fallbackText: 'Image not available', height: 200, width: 300 },
};
