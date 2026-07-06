/**
 * CSS Variables Token Helpers — React Native resolution
 *
 * Same public API as css-variables.ts (c, s, sh, ts, tw, tf, tl, tt, el, mo)
 * but resolves RAW px-based values from the native runtime registry instead
 * of emitting var() expressions (React Native has no CSS custom properties).
 *
 * Metro picks this file automatically over css-variables.ts (.native.ts
 * resolution), so shared styled files keep one import path.
 */

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
import {
  getNativeColor,
  getNativeFamily,
  getNativeSize,
  nativeElevation,
  nativeLeading,
  nativeMotion,
  nativeShape,
  nativeSpacing,
  nativeTracking,
  nativeWeight,
} from './native-values';

const toKebab = (str: string): string =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/(\d+)/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

export const c = (key: ColorToken): string => getNativeColor(key);

export const s = (key: SpacingToken): string => nativeSpacing[key];

export const sh = (key: ShapeToken): string => nativeShape[key];

export const tf = (key: FontFamilyToken): string => getNativeFamily(key);

export const ts = (key: FontSizeToken): string => getNativeSize(key);

export const tw = (key: FontWeightToken): string => String(nativeWeight[key]);

export const tl = (key: LineHeightToken): string => nativeLeading[key];

export const tt = (key: LetterSpacingToken): string => nativeTracking[key];

export const el = (key: ElevationToken): string => nativeElevation[key];

export const mo = (key: MotionToken): string => nativeMotion[key];

export { toKebab };
