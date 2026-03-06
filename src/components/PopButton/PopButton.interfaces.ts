/**
 * PopButton Component Interfaces
 *
 * Neubrutalismo style button with solid border + shadow effects.
 * Variants: yellow (default), blue, primary, secondary, accent, pill (rounded, no border).
 */

import type { ReactNode } from 'react';

export type PopButtonVariant = 'yellow' | 'blue' | 'pill' | 'primary' | 'secondary' | 'accent';

export interface PopButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: PopButtonVariant;
}

export interface StyledPopButtonProps {
  $variant?: PopButtonVariant;
}
