/**
 * Badge
 *
 * Generic badge component with variant and size support.
 */

import type { BadgeProps } from './Badge.interfaces';

import { StyledBadge } from './Badge.styled';

export const Badge = ({ children, className, size = 'md', variant = 'default' }: BadgeProps) => (
  <StyledBadge $size={size} $variant={variant} className={className}>
    {children}
  </StyledBadge>
);
