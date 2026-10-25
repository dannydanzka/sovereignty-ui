/**
 * Checkbox: Casilla con label.
 */

import { useState } from 'react';

import { Checkbox } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const CheckboxDemo = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <DemoSection title='Controlado'>
      <Checkbox
        checked={accepted}
        label='Acepto los términos'
        name='terms'
        onChange={setAccepted}
      />
      <DemoCaption>{accepted ? 'Aceptado' : 'Sin aceptar'}</DemoCaption>
    </DemoSection>
  );
};
