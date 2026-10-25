/**
 * Native theming: setSuiTokens() feeds the runtime registry (RN has no CSS variables); doubles as the
 * multi-tenant theming test.
 */

import { createBrandPalette, setSuiTokens } from '@dannydanzka/sovereignty-ui';

export const applyBrand = (): void => {
  setSuiTokens({
    ...createBrandPalette({ accent: '#FF4081', primary: '#5B4FCF' }),
    typography: {
      family: { body: 'System', display: 'System' },
    },
  });
};
