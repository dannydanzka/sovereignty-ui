/**
 * CSS Variables Token Helpers
 *
 * Provides typed helper functions that wrap design tokens in CSS custom properties
 * with static fallbacks. This enables runtime theming without ThemeProvider:
 *
 *   BEFORE: color: ${color.textPrimary};           // hardcoded at build time
 *   AFTER:  color: ${c('textPrimary')};             // var(--sui-text-primary, #1A237E)
 *
 * Consumers override via :root { --sui-text-primary: #navy; }
 */

import { color, elevation, motion, shape, spacing, typography } from './tokens';
import type {
  ColorToken,
  ElevationToken,
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  LetterSpacingToken,
  LineHeightToken,
  MotionToken,
  ShapeToken,
  SpacingToken,
} from './tokens.types';

const toKebab = (str: string): string =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/(\d+)/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

/**
 * Color helper: c('textPrimary') → 'var(--sui-text-primary, #1A237E)'
 */
export const c = (key: ColorToken): string => `var(--sui-${toKebab(key)}, ${color[key]})`;

/**
 * Spacing helper: s('md') → 'var(--sui-spacing-md, 1.5rem)'
 */
export const s = (key: SpacingToken): string => `var(--sui-spacing-${key}, ${spacing[key]})`;

/**
 * Shape helper: sh('md') → 'var(--sui-shape-md, 0.5rem)'
 */
export const sh = (key: ShapeToken): string => `var(--sui-shape-${key}, ${shape[key]})`;

/**
 * Typography family: tf('body') → 'var(--sui-font-family-body, system-ui, ...)'
 */
export const tf = (key: FontFamilyToken): string =>
  `var(--sui-font-family-${key}, ${typography.family[key]})`;

/**
 * Typography size: ts('sm') → 'var(--sui-font-size-sm, 0.875rem)'
 */
export const ts = (key: FontSizeToken): string =>
  `var(--sui-font-size-${key}, ${typography.size[key]})`;

/**
 * Typography weight: tw('bold') → 'var(--sui-font-weight-bold, 700)'
 */
export const tw = (key: FontWeightToken): string =>
  `var(--sui-font-weight-${key}, ${typography.weight[key]})`;

/**
 * Typography leading: tl('relaxed') → 'var(--sui-leading-relaxed, 1.75)'
 */
export const tl = (key: LineHeightToken): string =>
  `var(--sui-leading-${key}, ${typography.leading[key]})`;

/**
 * Typography tracking: tt('wide') → 'var(--sui-tracking-wide, 0.02em)'
 */
export const tt = (key: LetterSpacingToken): string =>
  `var(--sui-tracking-${key}, ${typography.tracking[key]})`;

/**
 * Elevation helper: el('md') → 'var(--sui-elevation-md, 0 8px 24px ...)'
 */
export const el = (key: ElevationToken): string => `var(--sui-elevation-${key}, ${elevation[key]})`;

/**
 * Motion helper: mo('normal') → 'var(--sui-motion-normal, 250ms ease-in-out)'
 */
export const mo = (key: MotionToken): string => `var(--sui-motion-${key}, ${motion[key]})`;

export { toKebab };
