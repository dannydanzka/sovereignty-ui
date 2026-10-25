/**
 * Alert: Alertas informativas, de éxito, advertencia y error.
 */

import { Alert } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const AlertDemo = () => (
  <>
    <DemoSection title='Variantes'>
      <Alert title='Aviso' variant='info'>
        Tu evento empieza el lunes.
      </Alert>
      <Alert title='Guardado' variant='success'>
        Tu evidencia se envió.
      </Alert>
      <Alert title='Cuidado' variant='warning'>
        Te falta subir una foto.
      </Alert>
      <Alert title='Error' variant='error'>
        No se pudo cargar el reto.
      </Alert>
    </DemoSection>
    <DemoSection title='Descartable'>
      <Alert onDismiss={() => undefined} title='Se puede cerrar' variant='info'>
        <DemoCaption>Toca la X para descartarla.</DemoCaption>
      </Alert>
    </DemoSection>
  </>
);
