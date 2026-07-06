/**
 * Lab Brand Tokens
 *
 * Demonstrates native theming: setSuiTokens() feeds the sovereignty-ui
 * runtime registry (RN has no CSS variables). Call once at app startup.
 */

import { createBrandPalette, setSuiTokens } from '@dannydanzka/sovereignty-ui';

export const applyLabBrand = (): void => {
  setSuiTokens({
    ...createBrandPalette({ accent: '#FF4081', primary: '#5B4FCF' }),
    typography: {
      family: { body: 'System', display: 'System' },
    },
  });
};
