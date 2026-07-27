/**
 * Card Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta = {
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'article', 'aside', 'blockquote', 'li', 'section'],
    },
    onClick: { action: 'clicked' },
    padding: { control: 'radio', options: ['none', 'small', 'medium', 'large'] },
    variant: { control: 'radio', options: ['elevated', 'outlined'] },
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

export const Outlined: Story = {
  args: {
    children:
      'Flat bordered surface — for a table or a form section, where a shadow reads as a tile',
    variant: 'outlined',
  },
};

export const OutlinedClipped: Story = {
  args: { children: 'Content clipped to the rounded corners', variant: 'outlined' },
  render: () => (
    <Card clipped padding='none' variant='outlined'>
      <div style={{ background: '#EEF2F7', padding: '12px' }}>Full-bleed header row</div>
      <div style={{ padding: '12px' }}>Rows sit flush against the border</div>
    </Card>
  ),
};

/** The reason `as` exists: a card row inside a real list stays an `li`, so the list stays a list. */
export const InAList: Story = {
  args: { children: 'Card content' },
  render: () => (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        width: '320px',
      }}
    >
      {['COT-0001', 'COT-0002', 'COT-0003'].map((folio) => (
        <Card element='li' key={folio} padding='medium' variant='outlined'>
          {folio}
        </Card>
      ))}
    </ul>
  ),
};
