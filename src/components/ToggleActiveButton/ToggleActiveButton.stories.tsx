/**
 * ToggleActiveButton Stories
 *
 * Covers all state combinations: active/inactive × loading × size × shape.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ToggleActiveButton } from './ToggleActiveButton';

const meta = {
  argTypes: {
    isActive: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    shape: { control: 'radio', options: ['square', 'circle'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
  component: ToggleActiveButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  title: 'Components/ToggleActiveButton',
} satisfies Meta<typeof ToggleActiveButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { isActive: false, onClick: () => {} },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>States — size sm, square</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ToggleActiveButton isActive={false} title='Activar' onClick={() => {}} />
          <ToggleActiveButton isActive title='Desactivar' onClick={() => {}} />
          <ToggleActiveButton isActive={false} isLoading title='Cargando...' onClick={() => {}} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Size md, square</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ToggleActiveButton isActive={false} size='md' onClick={() => {}} />
          <ToggleActiveButton isActive size='md' onClick={() => {}} />
          <ToggleActiveButton isActive={false} isLoading size='md' onClick={() => {}} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Shape circle, sm</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ToggleActiveButton isActive={false} shape='circle' onClick={() => {}} />
          <ToggleActiveButton isActive shape='circle' onClick={() => {}} />
          <ToggleActiveButton isActive={false} isLoading shape='circle' onClick={() => {}} />
        </div>
      </div>
    </div>
  ),
};

export const Inactive: Story = {
  args: { isActive: false, onClick: () => {} },
};

export const Active: Story = {
  args: { isActive: true, onClick: () => {} },
};

export const Loading: Story = {
  args: { isActive: false, isLoading: true, onClick: () => {} },
};

export const Circle: Story = {
  args: { isActive: false, onClick: () => {}, shape: 'circle' },
};

export const SizeMd: Story = {
  args: { isActive: false, onClick: () => {}, size: 'md' },
};
