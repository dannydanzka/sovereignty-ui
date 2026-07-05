/**
 * NotificationContainer Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../components/Button';
import { NotificationContainer } from './NotificationContainer';
import { useNotifications } from '../../hooks/useNotifications';

const meta: Meta<typeof NotificationContainer> = {
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
  },
  component: NotificationContainer,
  tags: ['autodocs'],
  title: 'Patterns/NotificationContainer',
};

export default meta;
type Story = StoryObj<typeof NotificationContainer>;

const QueueDemo = () => {
  const { notifications, notify, remove } = useNotifications({ autoDismissMs: 4000 });

  return (
    <div>
      <Button onClick={() => notify({ message: 'Entity saved', title: 'Done', type: 'success' })}>
        Success
      </Button>{' '}
      <Button
        variant='secondary'
        onClick={() => notify({ message: 'Request failed', type: 'error' })}
      >
        Error
      </Button>
      <NotificationContainer notifications={notifications} onClose={remove} />
    </div>
  );
};

export const WithUseNotifications: Story = {
  render: () => <QueueDemo />,
};
