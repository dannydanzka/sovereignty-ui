/**
 * StepCard Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { StepCard } from './StepCard';

const meta = {
  component: StepCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/StepCard',
} satisfies Meta<typeof StepCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { description: 'Step description', number: 1, title: 'Step title' },
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <StepCard
        description='Create your account and complete your profile.'
        number={1}
        title='Register'
      />
      <StepCard
        description='Choose your event and complete the payment process.'
        number={2}
        title='Enroll'
      />
      <StepCard
        description='Complete all challenges and submit your evidence.'
        number={3}
        title='Complete'
      />
    </div>
  ),
};

export const Default: Story = {
  args: {
    description: 'Create your account and complete your profile to get started.',
    number: 1,
    title: 'Create Account',
  },
};
