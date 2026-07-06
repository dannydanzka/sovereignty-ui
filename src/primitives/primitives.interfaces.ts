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
 */
export interface TextFieldPrimitiveProps extends WebCompatProps {
  autoComplete?: string;
  disabled?: boolean;
  id?: string;
  maxLength?: number;
  multiline?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  secureTextEntry?: boolean;
  /** Web input type; native maps it to keyboardType (password → secureTextEntry). */
  type?: 'email' | 'number' | 'password' | 'tel' | 'text';
  value?: string;
}
