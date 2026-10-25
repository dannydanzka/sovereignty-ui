/**
 * Spacer: Espacio vertical y horizontal.
 */

import { Spacer } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const SpacerDemo = () => (
  <DemoSection title='Vertical lg'>
    <DemoCaption>Antes</DemoCaption>
    <Spacer vertical='lg' />
    <DemoCaption>Después</DemoCaption>
  </DemoSection>
);
