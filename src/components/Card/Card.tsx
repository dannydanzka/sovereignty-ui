/**
 * Card Component
 *
 * Container with rounded corners: shadowed (`elevated`, the default) or bordered (`outlined`).
 * Supports clickable state with hover lift effect.
 *
 * Renders a `div` unless told otherwise. Pass `as` when the surrounding markup demands a specific
 * element — a card inside a `<ul>` must be an `li` or the list stops being a list.
 */

import type { CardProps } from './Card.interfaces';

import { StyledCard } from './Card.styled';

export const Card = ({
  as = 'div',
  children,
  className,
  clipped,
  onClick,
  padding = 'medium',
  variant = 'elevated',
}: CardProps) => (
  <StyledCard
    $clickable={Boolean(onClick)}
    $clipped={clipped}
    $padding={padding}
    $variant={variant}
    as={as}
    className={className}
    onClick={onClick}
  >
    {children}
  </StyledCard>
);
