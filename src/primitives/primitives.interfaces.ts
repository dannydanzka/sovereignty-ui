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
