/**
 * TapHint Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { TapHint } from './TapHint';

const meta = {
  argTypes: {
    autoHideMs: { control: { min: 0, type: 'number' } },
    position: { control: 'radio', options: ['bottom-right', 'top-right', 'center'] },
    size: { control: { max: 64, min: 16, type: 'range' } },
  },
  component: TapHint,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/TapHint',
} satisfies Meta<typeof TapHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { autoHideMs: 0, position: 'bottom-right', size: 32 },
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      {(['bottom-right', 'top-right', 'center'] as const).map((position) => (
        <div
          key={position}
          style={{ background: '#f0f0f0', height: '80px', position: 'relative', width: '80px' }}
        >
          <TapHint autoHideMs={0} position={position} size={32} />
          <span style={{ fontSize: '10px', left: '4px', position: 'absolute', top: '4px' }}>
            {position}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  args: { autoHideMs: 0, position: 'bottom-right', size: 32 },
  render: (args) => (
    <div style={{ height: '80px', position: 'relative', width: '80px', background: '#f0f0f0' }}>
      <TapHint {...args} />
    </div>
  ),
};
