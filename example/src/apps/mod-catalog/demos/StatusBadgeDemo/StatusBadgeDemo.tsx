/**
 * StatusBadge: Activo / inactivo.
 */

import { StatusBadge } from '@dannydanzka/sovereignty-ui';

import { DemoRow, DemoSection } from '../../presentation/components';

export const StatusBadgeDemo = () => (
  <DemoSection title='Estados'>
    <DemoRow>
      <StatusBadge isActive />
      <StatusBadge isActive={false} />
      <StatusBadge activeLabel='Publicado' isActive />
    </DemoRow>
  </DemoSection>
);
