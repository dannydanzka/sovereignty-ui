/**
 * InlineIcon Stories
 */

import { Calendar, TrendingUp, Users } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { InlineIcon } from './InlineIcon';

const meta: Meta<typeof InlineIcon> = {
  argTypes: {
    position: { control: 'select', options: ['left', 'top'] },
  },
  component: InlineIcon,
  tags: ['autodocs'],
  title: 'Components/InlineIcon',
};

export default meta;
type Story = StoryObj<typeof InlineIcon>;

export const BeforeText: Story = {
  render: () => (
    <span>
      <InlineIcon>
        <Calendar size={16} />
      </InlineIcon>
      Scheduled for tomorrow
    </span>
  ),
};

export const TightBadge: Story = {
  render: () => (
    <span>
      <InlineIcon tight>
        <Users size={14} />
      </InlineIcon>
      12 members
    </span>
  ),
};

export const StackedOverValue: Story = {
  render: () => (
    <div>
      <InlineIcon position='top'>
        <TrendingUp size={20} />
      </InlineIcon>
      <div>+24%</div>
    </div>
  ),
};
