/**
 * DetailLayout Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  DetailAmount,
  DetailContentBox,
  DetailDivider,
  DetailLabel,
  DetailRow,
  DetailSection,
  DetailValue,
} from './DetailLayout';

const meta: Meta = {
  tags: ['autodocs'],
  title: 'Layout/DetailLayout',
};

export default meta;
type Story = StoryObj;

export const BasicLayout: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <DetailSection>
        <DetailRow>
          <div>
            <DetailLabel>Name</DetailLabel>
            <DetailValue>John Doe</DetailValue>
          </div>
          <div>
            <DetailLabel>Email</DetailLabel>
            <DetailValue mono>john@example.com</DetailValue>
          </div>
        </DetailRow>
      </DetailSection>
      <DetailDivider />
      <DetailSection>
        <DetailRow columns={3}>
          <div>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>Active</DetailValue>
          </div>
          <div>
            <DetailLabel>Role</DetailLabel>
            <DetailValue>Administrator</DetailValue>
          </div>
          <div>
            <DetailLabel>Created</DetailLabel>
            <DetailValue>2026-01-15</DetailValue>
          </div>
        </DetailRow>
      </DetailSection>
    </div>
  ),
};

export const Amounts: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <DetailSection>
        <DetailLabel>Total Revenue</DetailLabel>
        <DetailAmount size='large'>$12,450.00</DetailAmount>
      </DetailSection>
      <DetailSection>
        <DetailLabel>Average Order</DetailLabel>
        <DetailAmount>$85.50</DetailAmount>
      </DetailSection>
    </div>
  ),
};

export const ContentBoxVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
      <DetailContentBox>Default content box with neutral styling.</DetailContentBox>
      <DetailContentBox variant='info'>
        Info content box for informational messages.
      </DetailContentBox>
      <DetailContentBox variant='warning'>
        Warning content box for caution messages.
      </DetailContentBox>
      <DetailContentBox variant='error'>Error content box for error messages.</DetailContentBox>
    </div>
  ),
};
