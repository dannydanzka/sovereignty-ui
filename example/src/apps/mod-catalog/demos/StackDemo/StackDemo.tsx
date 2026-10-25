/**
 * Stack: Columna y fila con gap de tokens.
 */

import { Badge, Stack } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const StackDemo = () => (
  <>
    <DemoSection title='Columna, gap md'>
      <Stack gap='md'>
        <Badge>uno</Badge>
        <Badge>dos</Badge>
        <Badge>tres</Badge>
      </Stack>
    </DemoSection>
    <DemoSection title='Fila, gap xs'>
      <Stack direction='row' gap='xs'>
        <Badge variant='primary'>uno</Badge>
        <Badge variant='primary'>dos</Badge>
        <Badge variant='primary'>tres</Badge>
      </Stack>
    </DemoSection>
  </>
);
