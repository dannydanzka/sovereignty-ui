/**
 * Divider Component
 *
 * Horizontal or vertical separator line.
 */

import type { DividerProps } from './Divider.interfaces';

import { StyledDivider } from './Divider.styled';

export const Divider = ({
  className,
  color,
  orientation = 'horizontal',
  spacing,
}: DividerProps) => (
  <StyledDivider
    $color={color}
    $orientation={orientation}
    $spacing={spacing}
    className={className}
    data-testid='divider'
  />
);
