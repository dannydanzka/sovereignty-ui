/**
 * Brand Palette Factory
 *
 * Expands a few brand base colors into a full SUI color-token override set by
 * generating a 50–900 shade scale (lighten toward white below 500, darken toward
 * black above 500). Agnostic: no project knowledge, pure color math.
 *
 * Pair with `injectSuiTokens` to theme all SUI components from a brand color:
 *
 * @example
 * ```typescript
 * import { createBrandPalette, injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';
 *
 * const GlobalStyles = createGlobalStyle`
 *   :root { ${injectSuiTokens(createBrandPalette({ accent: '#8B0000', primary: '#8B0000' }))} }
 * `;
 * ```
 */

import { ACCENT_STEPS, FULL_STEPS, SHADE_AMOUNT } from './create-brand-palette.constants';
import type { BrandPaletteInput } from './create-brand-palette.interfaces';
import type { ColorToken, TokenOverrides } from './tokens.types';

export type { BrandPaletteInput } from './create-brand-palette.interfaces';

const clampChannel = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

/** Parse #RGB or #RRGGBB (with or without leading #) to [r, g, b]. */
const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.trim().replace(/^#/, '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`createBrandPalette: invalid hex color "${hex}"`);
  }
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const rgbToHex = ([r, g, b]: [number, number, number]): string =>
  `#${[r, g, b].map((n) => clampChannel(n).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** Blend base toward target by amount (0..1). */
const mix = (
  base: [number, number, number],
  target: [number, number, number],
  amount: number
): [number, number, number] => [
  base[0] + (target[0] - base[0]) * amount,
  base[1] + (target[1] - base[1]) * amount,
  base[2] + (target[2] - base[2]) * amount,
];

const WHITE: [number, number, number] = [255, 255, 255];
const BLACK: [number, number, number] = [0, 0, 0];

/** Generate a shade for a step from a base rgb. */
const shadeForStep = (base: [number, number, number], step: number): string => {
  const amount = SHADE_AMOUNT[step] ?? 0;
  if (amount === 0) return rgbToHex(base);
  return rgbToHex(amount > 0 ? mix(base, WHITE, amount) : mix(base, BLACK, -amount));
};

const familyScale = (
  prefix: string,
  baseHex: string,
  steps: readonly number[]
): Record<string, string> => {
  const base = hexToRgb(baseHex);
  const out: Record<string, string> = {};
  for (const step of steps) {
    out[`${prefix}${step}`] = shadeForStep(base, step);
  }
  return out;
};

/**
 * Build SUI color-token overrides from brand base colors.
 * Only the families you pass are generated; everything else keeps library defaults.
 */
export const createBrandPalette = (input: BrandPaletteInput): TokenOverrides => {
  const color: Record<string, string> = {};

  if (input.accent) Object.assign(color, familyScale('accent', input.accent, ACCENT_STEPS));
  if (input.primary) {
    Object.assign(color, familyScale('primary', input.primary, FULL_STEPS));
    const [r, g, b] = hexToRgb(input.primary);
    color['primaryFocusShadow'] = `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
  if (input.secondary) {
    Object.assign(color, familyScale('secondary', input.secondary, FULL_STEPS));
  }

  return { color: color as Partial<Record<ColorToken, string>> };
};
