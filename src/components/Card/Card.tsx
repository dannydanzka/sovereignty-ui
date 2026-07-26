/**
 * Card Component
 *
 * Container with rounded corners: shadowed (`elevated`, the default) or bordered (`outlined`).
 * Supports clickable state with hover lift effect.
 */

import type { CardProps } from './Card.interfaces';

import { StyledCard } from './Card.styled';

export const Card = ({
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
    className={className}
    onClick={onClick}
  >
    {children}
  </StyledCard>
);
