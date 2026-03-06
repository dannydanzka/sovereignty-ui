/**
 * PopButton Component
 *
 * Neubrutalismo style button with multiple variants.
 * Solid variants use border + translateY shadow effect.
 * Pill/accent variants use rounded pill shape with scale animation.
 */

import type { PopButtonProps } from './PopButton.interfaces';

import { StyledPopButton } from './PopButton.styled';

export const PopButton = ({
  children,
  disabled,
  onClick,
  type = 'button',
  variant = 'yellow',
}: PopButtonProps) => (
  <StyledPopButton $variant={variant} disabled={disabled} type={type} onClick={onClick}>
    {children}
  </StyledPopButton>
);
