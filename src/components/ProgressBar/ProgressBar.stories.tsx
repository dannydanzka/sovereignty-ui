/**
 * ProgressBar Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';

const meta = {
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    value: { control: { max: 100, min: 0, type: 'range' } },
    variant: { control: 'radio', options: ['default', 'success', 'warning'] },
  },
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Components/ProgressBar',
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { value: 60 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <ProgressBar label='Default' value={60} />
      <ProgressBar label='Success' value={80} variant='success' />
      <ProgressBar label='Warning' value={40} variant='warning' />
      <ProgressBar label='Small' size='small' value={50} />
      <ProgressBar label='Large' size='large' value={70} />
      <ProgressBar label='No percentage' showPercentage={false} value={55} />
    </div>
  ),
};

export const Default: Story = {
  args: { label: 'Progreso', value: 65 },
};

export const Complete: Story = {
  args: { label: 'Completado', value: 100, variant: 'success' },
};
