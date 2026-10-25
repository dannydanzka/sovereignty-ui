/**
 * NotificationContainer: Cola de notificaciones (useNotifications).
 */

import {
  Badge,
  Button,
  NotificationContainer,
  useNotifications,
} from '@dannydanzka/sovereignty-ui';

import { DemoRow, DemoSection } from '../../presentation/components';

const AUTO_DISMISS_MS = 3000;

export const NotificationContainerDemo = () => {
  const { notifications, notify, remove } = useNotifications({ autoDismissMs: AUTO_DISMISS_MS });

  return (
    <DemoSection title='Lanzar'>
      <DemoRow>
        <Button
          onClick={() => notify({ message: 'Guardado', title: 'Listo', type: 'success' })}
          variant='primary'
        >
          Éxito
        </Button>
        <Button onClick={() => notify({ message: 'Algo falló', type: 'error' })} variant='danger'>
          Error
        </Button>
      </DemoRow>
      <Badge variant='info'>{`${notifications.length} activas`}</Badge>
      <NotificationContainer notifications={notifications} onClose={remove} position='top-right' />
    </DemoSection>
  );
};
