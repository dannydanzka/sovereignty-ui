/**
 * Card Component Interfaces
 */

import type { ReactNode } from 'react';

export type CardPadding = 'large' | 'medium' | 'none' | 'small';

/**
 * `elevated` (default) is the shadowed card. `outlined` is the flat bordered surface a table or a
 * form section sits in — the shadow reads as a floating tile there, which is why consumers ended up
 * hand-rolling a bordered div instead of using Card.
 */
export type CardVariant = 'elevated' | 'outlined';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Clips content to the rounded corners — needed when a table's first row touches the edge. */
  clipped?: boolean;
  padding?: CardPadding;
  variant?: CardVariant;
  onClick?: () => void;
}

export interface StyledCardProps {
  $clickable?: boolean;
  $clipped?: boolean;
  $padding: CardPadding;
  $variant: CardVariant;
}
