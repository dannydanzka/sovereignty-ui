/**
 * Chip Stories
 */

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  tags: ['autodocs'],
  title: 'Components/Chip',
};

export default meta;
type Story = StoryObj<typeof Chip>;

const CATEGORIES = [
  { label: 'Todas', value: 'all' },
  { label: 'Andamios', value: 'scaffolding' },
  { label: 'Puntales', value: 'props' },
  { label: 'Cimbra', value: 'formwork' },
];

/** A real component, not a `render` closure — the state hook needs a component to live in. */
const CategoryFilter = () => {
  const [active, setActive] = useState('all');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {CATEGORIES.map((category) => (
        <Chip
          key={category.value}
          label={category.label}
          selected={active === category.value}
          value={category.value}
          onSelect={setActive}
        />
      ))}
    </div>
  );
};

/** The reason the component exists: a filter row served by ONE handler, not one per option. */
export const FilterRow: Story = {
  args: { label: 'Andamios', value: 'scaffolding', onSelect: () => undefined },
  render: () => <CategoryFilter />,
};

export const Sizes: Story = {
  args: { label: 'Andamios', value: 'scaffolding', onSelect: () => undefined },
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
      <Chip label='Small' selected size='sm' value='sm' onSelect={() => undefined} />
      <Chip label='Medium' selected size='md' value='md' onSelect={() => undefined} />
    </div>
  ),
};

export const States: Story = {
  args: { label: 'Andamios', value: 'scaffolding', onSelect: () => undefined },
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
      <Chip label='Sin seleccionar' value='off' onSelect={() => undefined} />
      <Chip label='Seleccionado' selected value='on' onSelect={() => undefined} />
      <Chip disabled label='Deshabilitado' value='disabled' onSelect={() => undefined} />
    </div>
  ),
};
