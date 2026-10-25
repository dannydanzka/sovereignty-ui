/**
 * StatsCard: Métricas con ícono.
 */

import { TrendingUp, Users } from 'lucide-react-native';

import { StatsCard } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const StatsCardDemo = () => (
  <DemoSection title='Variantes'>
    <StatsCard
      icon={<Users size={16} />}
      label='Participantes'
      sublabel='+12% esta semana'
      value={1250}
      variant='primary'
    />
    <StatsCard icon={<TrendingUp size={16} />} label='Ingresos' value='$45K' variant='success' />
    <StatsCard label='Rechazadas' value={3} variant='danger' />
  </DemoSection>
);
