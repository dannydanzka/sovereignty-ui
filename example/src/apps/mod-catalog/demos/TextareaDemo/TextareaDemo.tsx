/**
 * Textarea: Multilínea con contador.
 */

import { useState } from 'react';

import { Textarea } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

const NOTES_MAX_LENGTH = 120;

export const TextareaDemo = () => {
  const [notes, setNotes] = useState('');

  return (
    <DemoSection title='Con contador'>
      <Textarea
        label='Notas'
        maxLength={NOTES_MAX_LENGTH}
        name='notes'
        onChange={setNotes}
        placeholder='Escribe algo…'
        showCount
        value={notes}
      />
    </DemoSection>
  );
};
