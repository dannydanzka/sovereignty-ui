/**
 * Form Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../components/Button';
import { Form } from './Form';
import { FormActions } from '../../components/FormActions';
import { Input } from '../../components/Input';

const meta = {
  argTypes: { gap: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] } },
  component: Form,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/Form',
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Input id='name' label='Nombre' name='name' placeholder='María García' />
        <Input id='email' label='Correo' name='email' type='email' />
        <FormActions>
          <Button variant='secondary'>Cancelar</Button>
          <Button type='submit'>Guardar</Button>
        </FormActions>
      </>
    ),
    gap: 'md',
  },
};

/** A form inside a modal: it scrolls via the vars, not via a per-modal wrapper. */
export const ScrollableInModal: Story = {
  args: { ...Default.args, gap: 'md' },
  render: (args) => (
    <div
      style={
        {
          '--sui-form-max-height': '160px',
          '--sui-form-overflow-y': 'auto',
          border: '1px dashed #999',
          padding: '12px',
        } as React.CSSProperties
      }
    >
      <Form {...args} />
    </div>
  ),
};
