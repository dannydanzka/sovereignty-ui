/**
 * NotificationToast: Un toast por tipo.
 */

import { NotificationToast } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const NotificationToastDemo = () => (
  <DemoSection title='Tipos'>
    <NotificationToast
      notification={{ id: 'toast-success', message: 'Evidencia aprobada', type: 'success' }}
    />
    <NotificationToast
      notification={{ id: 'toast-info', message: 'Nuevo reto disponible', type: 'info' }}
    />
    <NotificationToast
      notification={{ id: 'toast-warning', message: 'Te falta un reto', type: 'warning' }}
    />
    <NotificationToast
      notification={{ id: 'toast-error', message: 'No se pudo subir', type: 'error' }}
    />
  </DemoSection>
);
