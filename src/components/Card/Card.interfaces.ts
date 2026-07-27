/**
 * Card Component Interfaces
 */

import type { ReactNode } from 'react';

export type CardPadding = 'large' | 'medium' | 'none' | 'small';

/**
 * The element the card renders as.
 *
 * A card is a *surface*, not a *meaning*, and the meaning is the caller's: a card in a list is an
 * `li`, a self-contained record is an `article`, a side summary is an `aside`, a testimonial is a
 * `blockquote`. Before this the card was always a `div`, so adopting it inside a `<ul>` replaced the
 * `li`s with `div`s — invalid markup, and a screen reader stops announcing the list at all. That cost
 * is why consumers kept hand-rolling a bordered div instead.
 */
export type CardElement = 'article' | 'aside' | 'blockquote' | 'div' | 'li' | 'section';

/**
 * `elevated` (default) is the shadowed card. `outlined` is the flat bordered surface a table or a
 * form section sits in — the shadow reads as a floating tile there, which is why consumers ended up
 * hand-rolling a bordered div instead of using Card.
 */
export type CardVariant = 'elevated' | 'outlined';

export interface CardProps {
  /** The element to render. Defaults to `div`; use the tag the surrounding markup requires. */
  as?: CardElement;
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
