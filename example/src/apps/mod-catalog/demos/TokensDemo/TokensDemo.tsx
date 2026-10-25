/**
 * Tokens: the palette and the spacing scale as the native registry resolves them.
 */

import { DEMO_COLORS, DEMO_SPACING } from './TokensDemo.constants';
import { DemoCaption, DemoRow, DemoSection } from '../../presentation/components';

import { SpacingBar, Swatch } from './TokensDemo.styled';

export const TokensDemo = () => (
  <>
    <DemoSection title='Colores'>
      {DEMO_COLORS.map((token) => (
        <DemoRow key={token}>
          <Swatch $color={token} />
          <DemoCaption>{token}</DemoCaption>
        </DemoRow>
      ))}
    </DemoSection>
    <DemoSection title='Espaciado'>
      {DEMO_SPACING.map((token) => (
        <DemoRow key={token}>
          <SpacingBar $size={token} />
          <DemoCaption>{token}</DemoCaption>
        </DemoRow>
      ))}
    </DemoSection>
  </>
);
