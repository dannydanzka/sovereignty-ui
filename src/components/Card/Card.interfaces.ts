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
  /**
   * `as` is UNUSABLE as the polymorphic prop here and this `never` is what says so out loud.
   *
   * styled-components CONSUMES `as` on any styled component, including a wrapper around this one. So
   * `styled(Card)` + `as="li"` renders a bare `li` and Card never runs — the surface silently vanishes:
   * no border, no radius, no padding, no error, no failing test. That is not a hypothetical; it shipped
   * across 21 call sites in trackia and was caught by eye in a browser, not by the suite.
   *
   * Typing it `never` turns `<Card as='li'>` into a compile error. It does NOT catch
   * `<Wrapped as='li'>` — measured: styled-components' own polymorphic typing widens `as` on the
   * wrapper and wins, so the compiler stays silent on exactly the dangerous case. What catches that is
   * a test asserting the card SURFACE rendered (see `Card.test.tsx` → "still applies its surface when
   * a consumer wraps it in styled(Card)"), because a bypassed Card leaves no surface behind.
   *
   * MUI took the same road with `component` for the same collision.
   */
  as?: never;
  children: ReactNode;
  className?: string;
  /** Clips content to the rounded corners — needed when a table's first row touches the edge. */
  clipped?: boolean;
  /**
   * The element to render. Defaults to `div`; use the tag the surrounding markup requires.
   *
   * Named `element`, not `as`, so it behaves identically whether Card is used directly or wrapped in
   * `styled(Card)` — see the `as` field above for what `as` does instead.
   */
  element?: CardElement;
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
