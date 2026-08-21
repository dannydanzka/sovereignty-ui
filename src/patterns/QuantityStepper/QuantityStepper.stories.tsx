/**
 * QuantityStepper Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { QuantityStepper } from './QuantityStepper';

const meta: Meta<typeof QuantityStepper> = {
  component: QuantityStepper,
  tags: ['autodocs'],
  title: 'Patterns/QuantityStepper',
};

export default meta;
type Story = StoryObj<typeof QuantityStepper>;

const TEXTS = { decrease: 'Decrease quantity', increase: 'Increase quantity' };

const ControlledDemo = ({ hideLabel = false }: { hideLabel?: boolean }) => {
  const [value, setValue] = useState(1);

  return (
    <QuantityStepper
      hideLabel={hideLabel}
      id='qty'
      label='Quantity'
      name='qty'
      texts={TEXTS}
      value={value}
      onChange={(next) => {
        const parsed = Number(next);
        if (Number.isFinite(parsed) && parsed >= 1) setValue(parsed);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const HiddenLabel: Story = {
  render: () => <ControlledDemo hideLabel />,
};
