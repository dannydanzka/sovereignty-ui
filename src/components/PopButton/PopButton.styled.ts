/**
 * PopButton Styled Components
 *
 * Neubrutalismo style: solid border + box-shadow elevation on hover.
 * Pill variant: no border, scale animation.
 */

import styled, { css } from 'styled-components';

import { color, elevation, shape, spacing, typography } from '../../tokens';
import type { PopButtonVariant, StyledPopButtonProps } from './PopButton.interfaces';

const getBackgroundColor = (variant: PopButtonVariant) => {
  switch (variant) {
    case 'blue':
    case 'secondary':
      return color.secondary300;
    case 'pill':
    case 'accent':
      return color.accent500;
    case 'primary':
      return color.primary400;
    case 'yellow':
      return color.primary200;
  }
};

const isPillVariant = (variant?: PopButtonVariant) => variant === 'pill' || variant === 'accent';

const pillStyles = css`
  border: none;
  border-radius: 9999px;
  box-shadow: none;
  color: ${color.white};
  font-size: ${typography.size.sm};
  padding: ${spacing.sm} ${spacing.md};

  &:hover:not(:disabled) {
    box-shadow: none;
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    box-shadow: none;
    transform: scale(0.98);
  }
`;

const solidStyles = css`
  border: 2px solid ${color.neutral900};
  border-radius: ${shape.full};
  color: ${color.neutral900};
  padding: ${spacing.sm} ${spacing.lg};

  &:hover:not(:disabled) {
    box-shadow: ${elevation.md};
    transform: translateY(2px);
  }

  &:active:not(:disabled) {
    box-shadow: ${elevation.sm};
    transform: translateY(4px);
  }
`;

export const StyledPopButton = styled.button<StyledPopButtonProps>`
  background-color: ${({ $variant }) => getBackgroundColor($variant ?? 'yellow')};
  cursor: pointer;
  font-family: ${typography.family.body};
  font-size: ${typography.size['2xl']};
  font-weight: ${typography.weight.bold};
  letter-spacing: 0.02em;
  min-height: ${spacing['2xl']};
  transition: all 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${color.cyan500};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $variant }) => (isPillVariant($variant) ? pillStyles : solidStyles)}
`;
