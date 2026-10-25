/**
 * EmptyState: Estado vacío con ícono.
 */

import { Inbox } from 'lucide-react-native';

import { EmptyState } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const EmptyStateDemo = () => (
  <DemoSection title='Con ícono'>
    <EmptyState
      icon={<Inbox size={28} />}
      message='Cuando completes un reto aparecerá aquí.'
      title='Aún no hay evidencias'
    />
  </DemoSection>
);
