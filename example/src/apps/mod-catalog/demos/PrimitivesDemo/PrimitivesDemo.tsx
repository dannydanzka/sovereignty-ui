/**
 * Primitives: Div (View), Span (Text), Pressable (onClick → onPress) and TextField (onValueChange).
 */

import { useState } from 'react';

import { Pressable, Span, TextField } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

import { Box } from './PrimitivesDemo.styled';

export const PrimitivesDemo = () => {
  const [presses, setPresses] = useState(0);
  const [value, setValue] = useState('');

  return (
    <>
      <DemoSection title='Div + Span'>
        <Box>
          <Span>Texto dentro de un Div</Span>
        </Box>
      </DemoSection>
      <DemoSection title='Pressable'>
        <Pressable aria-label='Contar' onClick={() => setPresses((count) => count + 1)}>
          <DemoCaption>{`Presionado ${presses} veces`}</DemoCaption>
        </Pressable>
      </DemoSection>
      <DemoSection title='TextField'>
        <TextField onValueChange={setValue} placeholder='Escribe aquí' value={value} />
        <DemoCaption>{`Valor: ${value}`}</DemoCaption>
      </DemoSection>
    </>
  );
};
