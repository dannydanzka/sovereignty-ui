/**
 * InlineIcon Component
 *
 * Wrapper that aligns an icon with surrounding text or stacks it above a value.
 * Use position='left' before a text label, position='top' above a stat/number.
 */

import type { InlineIconProps } from './InlineIcon.interfaces';

import { StyledInlineIcon } from './InlineIcon.styled';

export const InlineIcon = ({
  children,
  className,
  position = 'left',
  tight = false,
}: InlineIconProps) => (
  <StyledInlineIcon $position={position} $tight={tight} className={className}>
    {children}
  </StyledInlineIcon>
);
