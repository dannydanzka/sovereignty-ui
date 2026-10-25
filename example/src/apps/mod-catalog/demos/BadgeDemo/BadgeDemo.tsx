/**
 * Badge: Etiquetas de estado.
 */

import { Badge } from '@dannydanzka/sovereignty-ui';

import { DemoRow, DemoSection } from '../../presentation/components';

export const BadgeDemo = () => (
  <DemoSection title='Variantes'>
    <DemoRow>
      <Badge>default</Badge>
      <Badge variant='primary'>primary</Badge>
      <Badge variant='success'>success</Badge>
      <Badge variant='warning'>warning</Badge>
      <Badge variant='danger'>danger</Badge>
      <Badge variant='info'>info</Badge>
    </DemoRow>
  </DemoSection>
);
