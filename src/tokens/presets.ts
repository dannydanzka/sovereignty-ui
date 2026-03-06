/**
 * Design System Presets
 *
 * Composed design tokens for common use cases.
 * These are combinations of base tokens for typography, components, etc.
 */

import { typography } from './tokens';

export const textPreset = {
  body: {
    fontFamily: typography.family.body,
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.relaxed,
  },
  bodyLarge: {
    fontFamily: typography.family.body,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.regular,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.relaxed,
  },
  bodySmall: {
    fontFamily: typography.family.body,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.relaxed,
  },
  button: {
    fontFamily: typography.family.display,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  buttonLarge: {
    fontFamily: typography.family.display,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  buttonSmall: {
    fontFamily: typography.family.display,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  caption: {
    fontFamily: typography.family.body,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.regular,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  displayLarge: {
    fontFamily: typography.family.display,
    fontSize: typography.size['8xl'],
    fontWeight: typography.weight.black,
    letterSpacing: typography.tracking.tight,
    lineHeight: typography.leading.tight,
  },
  displayMedium: {
    fontFamily: typography.family.display,
    fontSize: typography.size['7xl'],
    fontWeight: typography.weight.black,
    letterSpacing: typography.tracking.tight,
    lineHeight: typography.leading.tight,
  },
  displaySmall: {
    fontFamily: typography.family.display,
    fontSize: typography.size['5xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h1: {
    fontFamily: typography.family.display,
    fontSize: typography.size['6xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h2: {
    fontFamily: typography.family.display,
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h3: {
    fontFamily: typography.family.display,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h4: {
    fontFamily: typography.family.display,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h5: {
    fontFamily: typography.family.display,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  h6: {
    fontFamily: typography.family.display,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.normal,
    lineHeight: typography.leading.normal,
  },
  label: {
    fontFamily: typography.family.body,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  labelLarge: {
    fontFamily: typography.family.body,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  labelSmall: {
    fontFamily: typography.family.body,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
  },
  overline: {
    fontFamily: typography.family.body,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.tracking.wide,
    lineHeight: typography.leading.normal,
    textTransform: 'uppercase' as const,
  },
} as const;
