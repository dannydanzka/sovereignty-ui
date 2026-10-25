/**
 * Card — React Native resolution: no `element`, because a host tag (`div`, `li`) does not exist on native.
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
