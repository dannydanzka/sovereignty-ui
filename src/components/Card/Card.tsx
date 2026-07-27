/**
 * Card Component
 *
 * Container with rounded corners: shadowed (`elevated`, the default) or bordered (`outlined`).
 * Supports clickable state with hover lift effect.
 *
 * Renders a `div` unless told otherwise. Pass `element` when the surrounding markup demands a specific
 * tag — a card inside a `<ul>` must be an `li` or the list stops being a list. The prop is NOT called
 * `as`: styled-components consumes `as` on a `styled(Card)` wrapper and Card never runs.
 */

import type { CardProps } from './Card.interfaces';

import { StyledCard } from './Card.styled';

export const Card = ({
  children,
  className,
  clipped,
  element = 'div',
  onClick,
  padding = 'medium',
  variant = 'elevated',
}: CardProps) => (
  <StyledCard
    $clickable={Boolean(onClick)}
    $clipped={clipped}
    $padding={padding}
    $variant={variant}
    as={element}
    className={className}
    onClick={onClick}
  >
    {children}
  </StyledCard>
);
