/**
 * Divider: Separador horizontal.
 */

import { Divider } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const DividerDemo = () => (
  <DemoSection title='Horizontal'>
    <DemoCaption>Arriba del separador</DemoCaption>
    <Divider />
    <DemoCaption>Abajo del separador</DemoCaption>
  </DemoSection>
);
