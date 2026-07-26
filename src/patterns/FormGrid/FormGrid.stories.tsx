/**
 * FormGrid Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { FormGrid } from './FormGrid';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

const meta = {
  argTypes: { columns: { control: 'radio', options: [1, 2, 3] } },
  component: FormGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  title: 'Patterns/FormGrid',
} satisfies Meta<typeof FormGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Input
          id='name'
          label='Name'
          name='name'
          placeholder='e.g. Andamios'
          value=''
          onChange={() => {}}
        />
        <Input
          id='taxId'
          label='Tax ID'
          name='taxId'
          placeholder='XAXX010101000'
          value=''
          onChange={() => {}}
        />
        <FormGrid.Full>
          <Textarea
            label='Notes'
            placeholder='Anything worth remembering…'
            value=''
            onChange={() => {}}
          />
        </FormGrid.Full>
      </>
    ),
  },
};
