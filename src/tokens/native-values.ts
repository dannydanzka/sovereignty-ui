/**
 * Native Token Values + Runtime Registry
 *
 * React Native has no CSS custom properties, so the native token helpers
 * (css-variables.native.ts) resolve raw values from this registry instead of
 * emitting var() expressions. Values are px-based (1rem = 16px) because
 * css-to-react-native does not support rem/em/var().
 *
 * Pure module — no react-native imports — so it is unit-testable everywhere
 * and safe to export from the shared tokens barrel.
 */

import { color as webColor, typography as webTypography } from './tokens';
import type { NativeTokenState } from './native-values.interfaces';
import type { TokenOverrides } from './tokens.types';

export const nativeSpacing = {
  '2xl': '48px',
  '3xl': '56px',
  '4xl': '64px',
  '5xl': '72px',
  '6xl': '80px',
  '7xl': '96px',
  lg: '32px',
  md: '24px',
  micro: '4px',
  sm: '16px',
  xl: '40px',
  xs: '8px',
} as const;

export const nativeShape = {
  '2xl': '32px',
  full: '9999px',
  lg: '12px',
  md: '8px',
  none: '0px',
  sm: '4px',
  xl: '16px',
} as const;

export const nativeFontSize = {
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '36px',
  '6xl': '40px',
  '7xl': '48px',
  '8xl': '64px',
  base: '16px',
  lg: '18px',
  sm: '14px',
  xl: '20px',
  xs: '12px',
} as const;

export const nativeLeading = {
  normal: '24px',
  relaxed: '28px',
  tight: '19px',
} as const;

export const nativeTracking = {
  normal: '0px',
  tight: '-0.32px',
  wide: '0.32px',
} as const;

export const nativeFontFamily = {
  body: 'System',
  display: 'System',
  mono: 'Courier',
} as const;

export const nativeElevation = {
  card: '0px 8px 12px rgba(0, 0, 0, 0.15)',
  lg: '0px 20px 40px rgba(30, 58, 95, 0.12)',
  md: '0px 8px 24px rgba(30, 58, 95, 0.12)',
  none: '0px 0px 0px rgba(0, 0, 0, 0)',
  sm: '0px 2px 8px rgba(30, 58, 95, 0.08)',
  xl: '0px 30px 60px rgba(30, 58, 95, 0.16)',
} as const;

export const nativeMotion = {
  fast: '0ms',
  normal: '0ms',
  slow: '0ms',
} as const;

const defaultState = (): NativeTokenState => ({
  color: { ...(webColor as Record<string, string>) },
  family: { ...nativeFontFamily },
  size: { ...nativeFontSize },
});

let state: NativeTokenState = defaultState();

/**
 * Native counterpart of injectSuiTokens(): merges brand overrides into the
 * runtime registry consumed by the native token helpers. Call once at app
 * startup, before rendering SUI components.
 */
export const setSuiTokens = (overrides: TokenOverrides = {}): void => {
  if (overrides.color) {
    state.color = { ...state.color, ...(overrides.color as Record<string, string>) };
  }
  if (overrides.typography?.family) {
    state.family = { ...state.family, ...(overrides.typography.family as Record<string, string>) };
  }
  if (overrides.typography?.size) {
    state.size = { ...state.size, ...(overrides.typography.size as Record<string, string>) };
  }
};

/** Restore registry defaults (mainly for tests). */
export const resetSuiTokens = (): void => {
  state = defaultState();
};

export const getNativeColor = (key: string): string =>
  state.color[key] ?? (webColor as Record<string, string>)[key] ?? 'transparent';

export const getNativeFamily = (key: string): string => state.family[key] ?? nativeFontFamily.body;

export const getNativeSize = (key: string): string => state.size[key] ?? nativeFontSize.base;

export const nativeWeight = webTypography.weight;
