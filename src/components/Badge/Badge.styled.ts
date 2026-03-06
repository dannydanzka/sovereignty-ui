/**
 * Badge Styled Component
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';
import type { StyledBadgeProps } from './Badge.interfaces';

const getVariantStyles = ($variant: StyledBadgeProps['$variant']) => {
  switch ($variant) {
    case 'primary':
      return css`
        background: ${color.primary100};
        color: ${color.primary700};
      `;
    case 'success':
      return css`
        background: ${color.successBackground};
        color: ${color.successDark};
      `;
    case 'warning':
      return css`
        background: ${color.warningBackground};
        color: ${color.warningDark};
      `;
    case 'danger':
      return css`
        background: ${color.errorBackground};
        color: ${color.errorDark};
      `;
    case 'info':
      return css`
        background: ${color.secondary100};
        color: ${color.secondary700};
      `;
    case 'secondary':
      return css`
        background: ${color.secondary50};
        color: ${color.secondary600};
      `;
    case 'default':
    default:
      return css`
        background: ${color.neutral100};
        color: ${color.neutral700};
      `;
  }
};

const getSizeStyles = ($size: StyledBadgeProps['$size']) => {
  switch ($size) {
    case 'sm':
      return css`
        font-size: ${typography.size.xs};
        padding: 2px ${spacing.xs};
      `;
    case 'lg':
      return css`
        font-size: ${typography.size.sm};
        padding: ${spacing.xs} ${spacing.md};
      `;
    case 'md':
    case undefined:
    default:
      return css`
        font-size: ${typography.size.xs};
        padding: ${spacing.micro} ${spacing.sm};
      `;
  }
};

export const StyledBadge = styled.span<StyledBadgeProps>`
  border-radius: ${shape.full};
  display: inline-block;
  font-family: ${typography.family.body};
  font-weight: ${typography.weight.medium};
  white-space: nowrap;
  ${({ $size }) => getSizeStyles($size)}
  ${({ $variant }) => getVariantStyles($variant)}
`;
