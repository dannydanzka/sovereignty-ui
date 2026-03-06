/**
 * Design System Token Types
 *
 * TypeScript types for all design tokens.
 * Provides type safety and autocompletion.
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
