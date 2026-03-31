/**
 * PageLayout Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { PageLayout } from './PageLayout';

import { HeaderRow, SectionTitle } from './PageLayout.styled';

const meta: Meta<typeof PageLayout> = {
  argTypes: {
    title: { control: 'text' },
  },
  component: PageLayout,
  tags: ['autodocs'],
  title: 'Layout/PageLayout',
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  args: {
    children: <div style={{ background: '#F5F7FA', padding: '16px' }}>Page content goes here</div>,
    title: 'Dashboard',
  },
};

export const WithHeaderRow: Story = {
  render: () => (
    <PageLayout title='Users'>
      <HeaderRow>
        <SectionTitle>Active Users</SectionTitle>
        <button type='button'>Add User</button>
      </HeaderRow>
      <div style={{ background: '#F5F7FA', padding: '16px' }}>Table content</div>
    </PageLayout>
  ),
};

export const NoTitle: Story = {
  args: {
    children: (
      <div style={{ background: '#F5F7FA', padding: '16px' }}>Content without page title</div>
    ),
  },
};
