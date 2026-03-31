/**
 * StatItem Stories
 */

import { Activity, AlertTriangle, CheckCircle, TrendingUp, Users, XCircle } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { StatItem, StatsBar, StatsGrid } from './StatItem';

const meta: Meta<typeof StatItem> = {
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
  },
  component: StatItem,
  tags: ['autodocs'],
  title: 'Components/StatItem',
};

export default meta;
type Story = StoryObj<typeof StatItem>;

export const Default: Story = {
  args: {
    icon: <Users />,
    label: 'Total Users',
    value: 1250,
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <StatsGrid columns={3}>
      <StatItem icon={<Users />} label='Total' value={1250} />
      <StatItem icon={<TrendingUp />} label='Revenue' value='$45K' variant='primary' />
      <StatItem icon={<CheckCircle />} label='Active' value={980} variant='success' />
      <StatItem icon={<AlertTriangle />} label='Pending' value={45} variant='warning' />
      <StatItem icon={<XCircle />} label='Failed' value={12} variant='danger' />
      <StatItem icon={<Activity />} label='Online' value={328} variant='info' />
    </StatsGrid>
  ),
};

export const InStatsBar: Story = {
  render: () => (
    <StatsBar>
      <StatItem label='Users' value={150} variant='primary' />
      <StatItem label='Active' value={120} variant='success' />
      <StatItem label='Pending' value={30} variant='warning' />
    </StatsBar>
  ),
};
