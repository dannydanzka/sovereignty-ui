/**
 * Stack
 *
 * A flex row or column with token spacing between children. Every screen ends up hand-rolling this
 * one — `display: flex; flex-direction: column; gap: <token>` — which is how "the same layout" drifts
 * into a dozen slightly different gaps. `Spacer` inserts space between two things; `Stack` owns the
 * rhythm of a whole group.
 */

import type { StackProps } from './Stack.interfaces';

import { StyledStack } from './Stack.styled';

export const Stack = ({
  align,
  children,
  className,
  direction = 'column',
  gap = 'md',
  justify,
  wrap,
}: StackProps) => (
  <StyledStack
    $align={align}
    $direction={direction}
    $gap={gap}
    $justify={justify}
    $wrap={wrap}
    className={className}
    data-testid='stack'
  >
    {children}
  </StyledStack>
);
