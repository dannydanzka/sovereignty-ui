/**
 * Spacer Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Spacer } from './Spacer';

const meta: Meta<typeof Spacer> = {
  argTypes: {
    horizontal: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    mode: { control: 'radio', options: ['margin', 'padding'] },
    vertical: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
  },
  component: Spacer,
  tags: ['autodocs'],
  title: 'Utilities/Spacer',
};

export default meta;
type Story = StoryObj<typeof Spacer>;

export const VerticalSpace: Story = {
  render: () => (
    <div>
      <div style={{ background: '#E3F2FD', padding: '8px' }}>Block A</div>
      <Spacer vertical='md' />
      <div style={{ background: '#E3F2FD', padding: '8px' }}>Block B</div>
    </div>
  ),
};

export const HorizontalSpace: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      <div style={{ background: '#E3F2FD', padding: '8px' }}>Left</div>
      <Spacer horizontal='lg' />
      <div style={{ background: '#E3F2FD', padding: '8px' }}>Right</div>
    </div>
  ),
};

export const WrapperWithPadding: Story = {
  render: () => (
    <Spacer horizontal='lg' mode='padding' vertical='md'>
      <div style={{ background: '#FFF9C4', padding: '8px' }}>Content with padding around it</div>
    </Spacer>
  ),
};

export const WrapperWithMargin: Story = {
  render: () => (
    <div style={{ background: '#F5F7FA' }}>
      <Spacer horizontal='md' mode='margin' vertical='lg'>
        <div style={{ background: '#FFF9C4', padding: '8px' }}>Content with margin around it</div>
      </Spacer>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
        <div key={size}>
          <div style={{ background: '#E3F2FD', padding: '4px' }}>{size}</div>
          <Spacer vertical={size} />
        </div>
      ))}
      <div style={{ background: '#E3F2FD', padding: '4px' }}>end</div>
    </div>
  ),
};
