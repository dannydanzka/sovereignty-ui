/**
 * Token Injection — React Native resolution
 *
 * On native there is no :root and no CSS variables: injectSuiTokens() applies
 * the overrides to the runtime token registry (same effect as setSuiTokens)
 * and returns an empty string so isomorphic call sites keep working.
 */

import { setSuiTokens } from './native-values';
import type { TokenOverrides } from './tokens.types';

export const injectSuiTokens = (overrides: TokenOverrides = {}): string => {
  setSuiTokens(overrides);
  return '';
};
