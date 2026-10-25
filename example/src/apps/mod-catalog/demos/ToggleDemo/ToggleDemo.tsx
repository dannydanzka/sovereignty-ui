/**
 * Toggle: Interruptor y tamaño chico.
 */

import { useState } from 'react';

import { Toggle } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const ToggleDemo = () => {
  const [reminders, setReminders] = useState(true);

  return (
    <DemoSection title='Controlado'>
      <Toggle checked={reminders} label='Recordatorios' name='reminders' onChange={setReminders} />
      <Toggle
        checked={reminders}
        label='Chico'
        name='reminders-sm'
        onChange={setReminders}
        size='sm'
      />
    </DemoSection>
  );
};
