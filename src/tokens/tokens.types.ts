/**
 * Design System Token Types
 *
 * Type contracts for all design tokens.
 * Provides type safety, autocompletion, and structural types for createTokens overrides.
 */

import type { color, elevation, layout, motion, shape, spacing, typography } from './tokens';

export type SpacingToken = keyof typeof spacing;
export type ColorToken = keyof typeof color;
export type ElevationToken = keyof typeof elevation;
export type ShapeToken = keyof typeof shape;
export type MotionToken = keyof typeof motion;

export type FontFamilyToken = keyof typeof typography.family;
export type FontSizeToken = keyof typeof typography.size;
export type FontWeightToken = keyof typeof typography.weight;
export type LineHeightToken = keyof typeof typography.leading;
export type LetterSpacingToken = keyof typeof typography.tracking;

export type BreakpointToken = keyof typeof layout.breakpoint;
export type ContainerToken = keyof typeof layout.container;
export type ZIndexToken = keyof typeof layout.zIndex;
export type IconSizeToken = keyof typeof layout.icon;

export type SpacingValue = (typeof spacing)[SpacingToken];
export type ColorValue = (typeof color)[ColorToken];
export type ElevationValue = (typeof elevation)[ElevationToken];
export type ShapeValue = (typeof shape)[ShapeToken];
export type MotionValue = (typeof motion)[MotionToken];

export interface ColorTokens {
  readonly [key: string]: string;
}

export interface TypographyFamilyTokens {
  readonly body: string;
  readonly display: string;
  readonly mono: string;
}

export interface TypographyTokens {
  readonly family: TypographyFamilyTokens;
  readonly leading: typeof typography.leading;
  readonly size: typeof typography.size;
  readonly tracking: typeof typography.tracking;
  readonly weight: typeof typography.weight;
}

export interface TokenOverrides {
  readonly color?: Partial<typeof color>;
  readonly typography?: {
    readonly family?: Partial<TypographyFamilyTokens>;
  };
}
