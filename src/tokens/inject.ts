/**
 * Token Injection for Consumer Projects
 *
 * Generates CSS variable declarations so consumer projects can theme SUI components.
 *
 * @example
 * import { injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';
 *
 * const GlobalStyles = createGlobalStyle`
 *   :root {
 *     ${injectSuiTokens({ color: myProjectColors, typography: { family: myFonts } })}
 *   }
 * `;
 */

import { color, elevation, motion, shape, spacing, typography } from './tokens';
import { toKebab } from './css-variables';
import type { TokenOverrides } from './tokens.types';

export const injectSuiTokens = (overrides: TokenOverrides = {}): string => {
  const mergedColor = { ...color, ...overrides.color };
  const mergedFamily = { ...typography.family, ...overrides.typography?.family };

  const colorVars = Object.entries(mergedColor)
    .map(([key, val]) => `--sui-${toKebab(key)}: ${val};`)
    .join('\n    ');

  const familyVars = Object.entries(mergedFamily)
    .map(([key, val]) => `--sui-font-family-${key}: ${val};`)
    .join('\n    ');

  const sizeVars = Object.entries(typography.size)
    .map(([key, val]) => `--sui-font-size-${key}: ${val};`)
    .join('\n    ');

  const weightVars = Object.entries(typography.weight)
    .map(([key, val]) => `--sui-font-weight-${key}: ${val};`)
    .join('\n    ');

  const leadingVars = Object.entries(typography.leading)
    .map(([key, val]) => `--sui-leading-${key}: ${val};`)
    .join('\n    ');

  const trackingVars = Object.entries(typography.tracking)
    .map(([key, val]) => `--sui-tracking-${key}: ${val};`)
    .join('\n    ');

  const spacingVars = Object.entries(spacing)
    .map(([key, val]) => `--sui-spacing-${key}: ${val};`)
    .join('\n    ');

  const shapeVars = Object.entries(shape)
    .map(([key, val]) => `--sui-shape-${key}: ${val};`)
    .join('\n    ');

  const elevationVars = Object.entries(elevation)
    .map(([key, val]) => `--sui-elevation-${key}: ${val};`)
    .join('\n    ');

  const motionVars = Object.entries(motion)
    .map(([key, val]) => `--sui-motion-${key}: ${val};`)
    .join('\n    ');

  return [
    colorVars,
    familyVars,
    sizeVars,
    weightVars,
    leadingVars,
    trackingVars,
    spacingVars,
    shapeVars,
    elevationVars,
    motionVars,
  ].join('\n    ');
};
