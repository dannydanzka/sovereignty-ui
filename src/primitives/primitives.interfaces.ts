/**
 * Primitives Interfaces
 */

import type { MouseEvent, ReactNode } from 'react';

/**
 * Props every primitive tolerates so shared component files keep passing web
 * attributes; React Native resolutions ignore them (or map them via `.attrs`).
 */
export interface WebCompatProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * Pressable — cross-platform tap target.
 *
 * Web renders a real <button> (keyboard + a11y for free); the native resolution
 * maps `onClick` to TouchableOpacity's `onPress` and `disabled` inside
 * `primitives.styled.native.ts`, so shared component files keep passing the web
 * `onClick`/`disabled` props unchanged.
 */
export interface PressablePrimitiveProps extends WebCompatProps {
  'aria-label'?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: 'button' | 'reset' | 'submit';
}

/**
 * TextField — cross-platform text entry.
 *
 * Both platforms expose ONE change API: `onValueChange(value)`. The web
 * resolution adapts the DOM change event and the native resolution adapts
 * `onChangeText`, so shared component files never touch `event.target.value`
 * (which does not exist on React Native). `secureTextEntry`/`multiline`/`rows`
 * map to the right web attribute or the matching TextInput prop per platform.
 *
 * `min`/`max`/`step` are web-only constraints (`number`/`date` inputs): React
 * Native's TextInput has no equivalent, so the native resolution drops them and
 * the value must be validated by the form schema — which is where a bound
 * belongs anyway, since a browser constraint is a hint, not a guarantee.
 */
export interface TextFieldPrimitiveProps extends WebCompatProps {
  autoComplete?: string;
  disabled?: boolean;
  id?: string;
  /** On-screen keyboard hint. Web `inputmode`; native maps it to keyboardType. */
  inputMode?: 'decimal' | 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url';
  /** Upper bound for `number`/`date` types. Ignored by native (no native equivalent). */
  max?: number | string;
  maxLength?: number;
  /** Lower bound for `number`/`date` types. Ignored by native (no native equivalent). */
  min?: number | string;
  multiline?: boolean;
  name?: string;
  onBlur?: () => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  secureTextEntry?: boolean;
  /** Granularity for `number`/`date` types. Ignored by native. */
  step?: number | string;
  /** Web input type; native maps it to keyboardType (password → secureTextEntry). */
  type?: 'date' | 'email' | 'number' | 'password' | 'tel' | 'text';
  value?: string;
}
