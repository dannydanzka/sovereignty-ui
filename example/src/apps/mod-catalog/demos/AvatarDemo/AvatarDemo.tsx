/**
 * Avatar: Iniciales y tamaños.
 */

import { Avatar } from '@dannydanzka/sovereignty-ui';

import { DemoRow, DemoSection } from '../../presentation/components';

export const AvatarDemo = () => (
  <DemoSection title='Tamaños'>
    <DemoRow>
      <Avatar name='María García' size='sm' />
      <Avatar name='María García' size='md' />
      <Avatar name='José López' size='lg' />
      <Avatar name='Ana Torres' size='xl' />
    </DemoRow>
  </DemoSection>
);
