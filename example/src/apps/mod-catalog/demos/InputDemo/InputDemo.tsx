/**
 * Input: Texto, correo, contraseña y error.
 */

import { useState } from 'react';

import { Input } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const InputDemo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <DemoSection title='Tipos'>
        <Input
          id='demo-email'
          label='Correo'
          name='email'
          onChange={setEmail}
          placeholder='tu@correo.com'
          type='email'
          value={email}
        />
        <Input
          id='demo-password'
          label='Contraseña'
          name='password'
          onChange={setPassword}
          placeholder='Tu contraseña'
          type='password'
          value={password}
        />
      </DemoSection>
      <DemoSection title='Con error'>
        <Input
          error='El correo no es válido'
          id='demo-error'
          label='Correo'
          name='bad-email'
          value='maria@'
        />
      </DemoSection>
    </>
  );
};
