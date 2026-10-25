/**
 * Card: Elevada, con borde y presionable.
 */

import { useState } from 'react';

import { Card } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const CardDemo = () => {
  const [taps, setTaps] = useState(0);

  return (
    <DemoSection title='Variantes'>
      <Card padding='medium'>
        <DemoCaption>Elevada (default)</DemoCaption>
      </Card>
      <Card padding='medium' variant='outlined'>
        <DemoCaption>Con borde</DemoCaption>
      </Card>
      <Card onClick={() => setTaps((count) => count + 1)} padding='medium'>
        <DemoCaption>{`Presionable: ${taps} toques`}</DemoCaption>
      </Card>
    </DemoSection>
  );
};
