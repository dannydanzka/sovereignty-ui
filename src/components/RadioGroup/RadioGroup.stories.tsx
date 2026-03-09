/**
 * RadioGroup Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Radio, RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  tags: ['autodocs'],
  title: 'Components/RadioGroup',
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Vertical: Story = {
  args: {
    children: (
      <>
        <Radio checked label='Option A' name='demo' value='a' />
        <Radio label='Option B' name='demo' value='b' />
        <Radio label='Option C' name='demo' value='c' />
      </>
    ),
    direction: 'vertical',
  },
};

export const Horizontal: Story = {
  args: {
    children: (
      <>
        <Radio checked label='Small' name='size' value='sm' />
        <Radio label='Medium' name='size' value='md' />
        <Radio label='Large' name='size' value='lg' />
      </>
    ),
    direction: 'horizontal',
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <>
        <Radio checked disabled label='Selected (disabled)' name='dis' value='a' />
        <Radio disabled label='Unselected (disabled)' name='dis' value='b' />
      </>
    ),
  },
};
