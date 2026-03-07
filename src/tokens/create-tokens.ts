/**
 * Token Factory
 *
 * Creates a customized token set by merging project-specific overrides
 * with agnostic defaults. Projects use this to set their brand colors
 * and typography without modifying the library.
 *
 * @example
 * ```typescript
 * import { createTokens } from 'sovereignty-ui/tokens';
 *
 * const { color, typography } = createTokens({
 *   color: {
 *     primary500: '#FFC107',
 *     secondary500: '#2196F3',
 *     accent500: '#FF00B2',
 *   },
 *   typography: {
 *     family: {
 *       body: "'Inter', sans-serif",
 *       display: "'Lato', sans-serif",
 *     },
 *   },
 * });
 * ```
 */

import { color as defaultColor, typography as defaultTypography } from './tokens';
import type { TokenOverrides } from './tokens.types';

export const createTokens = (overrides: TokenOverrides = {}) => ({
  color: {
    ...defaultColor,
    ...overrides.color,
  } as typeof defaultColor,
  typography: {
    ...defaultTypography,
    family: {
      ...defaultTypography.family,
      ...overrides.typography?.family,
    },
  } as typeof defaultTypography,
});
