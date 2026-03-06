/**
 * Container Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Container } from './Container';

const meta = {
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large', 'full'] },
  },
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  title: 'Components/Container',
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const boxStyle = { background: '#e0e7ff', padding: '16px', textAlign: 'center' as const };

export const AllSizes: Story = {
  args: { children: 'Container content', size: 'medium' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(['small', 'medium', 'large', 'full'] as const).map((size) => (
        <Container key={size} size={size}>
          <div style={boxStyle}>{`size="${size}"`}</div>
        </Container>
      ))}
    </div>
  ),
};

export const Medium: Story = {
  args: { children: <div style={boxStyle}>Medium container</div>, size: 'medium' },
};
