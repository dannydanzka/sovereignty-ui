/**
 * ProgressBar: Progreso por variante.
 */

import { ProgressBar } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const ProgressBarDemo = () => (
  <DemoSection title='Variantes'>
    <ProgressBar label='Subida' value={72} />
    <ProgressBar label='Retos' value={45} variant='warning' />
    <ProgressBar label='Completado' value={100} variant='success' />
  </DemoSection>
);
