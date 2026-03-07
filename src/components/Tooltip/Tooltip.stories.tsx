import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  argTypes: {
    content: { control: 'text' },
    position: { control: 'radio', options: ['top', 'bottom', 'left', 'right'] },
  },
  component: Tooltip,
  tags: ['autodocs'],
  title: 'Components/Tooltip',
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    children: <Button variant='secondary'>Hover me</Button>,
    content: 'Tooltip on top',
    position: 'top',
  },
  decorators: [
    (StoryFn) => (
      <div style={{ padding: '4rem' }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const Bottom: Story = {
  args: {
    children: <Button variant='secondary'>Hover me</Button>,
    content: 'Tooltip on bottom',
    position: 'bottom',
  },
  decorators: [
    (StoryFn) => (
      <div style={{ padding: '4rem' }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const AllPositions: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ padding: '4rem' }}>
        <StoryFn />
      </div>
    ),
  ],
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '2rem' }}>
      <Tooltip content='Top' position='top'>
        <Button size='sm' variant='outline'>
          Top
        </Button>
      </Tooltip>
      <Tooltip content='Bottom' position='bottom'>
        <Button size='sm' variant='outline'>
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content='Left' position='left'>
        <Button size='sm' variant='outline'>
          Left
        </Button>
      </Tooltip>
      <Tooltip content='Right' position='right'>
        <Button size='sm' variant='outline'>
          Right
        </Button>
      </Tooltip>
    </div>
  ),
};
