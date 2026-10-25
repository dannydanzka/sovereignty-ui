/**
 * InlineIcon: Ícono alineado al texto.
 */

import { Users } from 'lucide-react-native';

import { InlineIcon } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoRow, DemoSection } from '../../presentation/components';

export const InlineIconDemo = () => (
  <DemoSection title='Junto a un texto'>
    <DemoRow>
      <InlineIcon>
        <Users size={16} />
      </InlineIcon>
      <DemoCaption>12 participantes en línea</DemoCaption>
    </DemoRow>
  </DemoSection>
);
