/**
 * Button: Variantes, tamaños, deshabilitado y cargando (useLoading).
 */

import { Button, useLoading } from '@dannydanzka/sovereignty-ui';

import { DemoRow, DemoSection } from '../../presentation/components';

const SIMULATED_WORK_MS = 1500;

export const ButtonDemo = () => {
  const { isLoading, withLoading } = useLoading();
  const runTask = () =>
    withLoading(() => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_WORK_MS)));

  return (
    <>
      <DemoSection title='Variantes'>
        <DemoRow>
          <Button variant='primary'>Primary</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='brand'>Brand</Button>
          <Button variant='brand-outline'>Brand outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='danger'>Danger</Button>
        </DemoRow>
      </DemoSection>
      <DemoSection title='Tamaños'>
        <DemoRow>
          <Button size='sm'>Chico</Button>
          <Button size='md'>Mediano</Button>
          <Button size='lg'>Grande</Button>
        </DemoRow>
      </DemoSection>
      <DemoSection title='Estados (useLoading)'>
        <Button disabled>Deshabilitado</Button>
        <Button fullWidth loading={isLoading} onClick={runTask} variant='brand'>
          Guardar
        </Button>
      </DemoSection>
    </>
  );
};
