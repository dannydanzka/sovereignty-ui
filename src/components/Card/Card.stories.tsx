/**
 * Card Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta = {
  argTypes: {
    onClick: { action: 'clicked' },
    padding: { control: 'radio', options: ['none', 'small', 'medium', 'large'] },
  },
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/Card',
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { children: 'Card content' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      {(['none', 'small', 'medium', 'large'] as const).map((padding) => (
        <Card key={padding} padding={padding}>
          <p style={{ margin: 0 }}>Padding: {padding}</p>
        </Card>
      ))}
      <Card onClick={() => {}}>
        <p style={{ margin: 0 }}>Clickable card (hover me)</p>
      </Card>
    </div>
  ),
};

export const Default: Story = {
  args: { children: 'Default card with medium padding', padding: 'medium' },
};

export const Clickable: Story = {
  args: { children: 'Click me', onClick: () => alert('clicked') },
};
