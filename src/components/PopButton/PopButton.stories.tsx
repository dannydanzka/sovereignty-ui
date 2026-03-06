import type { Meta, StoryObj } from '@storybook/react';

import { PopButton } from './PopButton';

const meta: Meta<typeof PopButton> = {
  title: 'Components/PopButton',
  component: PopButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['yellow', 'blue', 'pill', 'primary', 'secondary', 'accent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopButton>;

export const Yellow: Story = {
  args: { children: '¡Inscríbete ahora!', variant: 'yellow' },
};

export const Blue: Story = {
  args: { children: 'Ver más', variant: 'blue' },
};

export const Pill: Story = {
  args: { children: 'Únete', variant: 'pill' },
};

export const Accent: Story = {
  args: { children: 'Miembros', variant: 'accent' },
};

export const Primary: Story = {
  args: { children: 'Continuar', variant: 'primary' },
};

export const Disabled: Story = {
  args: { children: 'No disponible', variant: 'yellow', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '24px' }}>
      <PopButton variant='yellow'>Yellow</PopButton>
      <PopButton variant='blue'>Blue</PopButton>
      <PopButton variant='primary'>Primary</PopButton>
      <PopButton variant='secondary'>Secondary</PopButton>
      <PopButton variant='accent'>Accent</PopButton>
      <PopButton variant='pill'>Pill</PopButton>
    </div>
  ),
};
