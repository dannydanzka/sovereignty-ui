import { Download, Plus, Trash2 } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'danger',
        'success',
        'warning',
        'ghost',
        'outline',
        'brand-outline',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'small', 'medium', 'large'],
    },
    shape: {
      control: 'select',
      options: ['default', 'pill', 'square'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
    icon: <Trash2 size={16} />,
  },
};

export const Success: Story = {
  args: {
    children: 'Confirm',
    variant: 'success',
  },
};

export const WithIconLeft: Story = {
  args: {
    children: 'Create',
    variant: 'primary',
    icon: <Plus size={16} />,
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'Download',
    variant: 'outline',
    icon: <Download size={16} />,
    iconPosition: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    icon: <Plus size={16} />,
    iconOnly: true,
    'aria-label': 'Add item',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving...',
    variant: 'primary',
    loading: true,
  },
};

export const Pill: Story = {
  args: {
    children: 'Pill Shape',
    variant: 'primary',
    shape: 'pill',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px' }}>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='danger'>Danger</Button>
      <Button variant='success'>Success</Button>
      <Button variant='warning'>Warning</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='outline'>Outline</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
      <Button size='sm' variant='primary'>
        Small
      </Button>
      <Button size='md' variant='primary'>
        Medium
      </Button>
      <Button size='lg' variant='primary'>
        Large
      </Button>
      <Button size='large' variant='primary'>
        Large
      </Button>
    </div>
  ),
};
