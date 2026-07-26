/**
 * Stack Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from './Stack';

const meta = {
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    direction: { control: 'radio', options: ['column', 'row'] },
    gap: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
  component: Stack,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Utilities/Stack',
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = (label: string) => (
  <div key={label} style={{ background: '#EEF2F7', borderRadius: 8, padding: '12px' }}>
    {label}
  </div>
);

export const Default: Story = {
  args: { children: ['Uno', 'Dos', 'Tres'].map(box) },
};

export const Row: Story = {
  args: { children: ['Uno', 'Dos', 'Tres'].map(box), direction: 'row', gap: 'sm' },
};

export const RowSpaceBetween: Story = {
  args: {
    align: 'center',
    children: ['Título', 'Acción'].map(box),
    direction: 'row',
    justify: 'between',
  },
};

export const Gaps: Story = {
  args: { children: null },
  render: () => (
    <Stack gap='lg'>
      {(['xs', 'sm', 'md', 'lg'] as const).map((gap) => (
        <Stack direction='row' gap={gap} key={gap}>
          {[`gap ${gap}`, '·', '·'].map(box)}
        </Stack>
      ))}
    </Stack>
  ),
};
