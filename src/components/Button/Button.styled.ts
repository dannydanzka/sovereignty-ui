/**
 * Button Styled Components
 *
 * Unified styles for all button variants:
 * - Semantic: primary, secondary, success, warning, danger
 * - Structural: outline, ghost
 * - Modes: iconOnly, fullWidth
 */

'use client';

import styled, { css, keyframes } from 'styled-components';

import { brandColor, color, shape, spacing, typography } from '../../tokens';
import type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  StyledButtonProps,
} from './Button.interfaces';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const getVariantStyles = (variant: ButtonVariant) => {
  const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
    accent: css`
      background: ${color.accent500};
      border: none;
      color: ${color.white};

      &:hover:not(:disabled) {
        background: ${color.accent600};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.accent200};
      }
    `,
    brand: css`
      background: ${brandColor.landingPinkVibrant};
      border: none;
      color: ${color.white};

      &:hover:not(:disabled) {
        background: ${color.accent700};
        transform: translateY(-1px);
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.accent200};
      }
    `,
    'brand-ghost': css`
      background: transparent;
      border: none;
      color: ${brandColor.landingPinkVibrant};

      &:hover:not(:disabled) {
        color: ${color.accent700};
        text-decoration: underline;
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px ${color.accent200};
      }
    `,
    'brand-outline': css`
      background: ${color.white};
      border: 2px solid ${brandColor.landingPinkVibrant};
      color: ${brandColor.landingPinkVibrant};

      &:hover:not(:disabled) {
        background: ${brandColor.landingPinkVibrant};
        color: ${color.white};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.accent200};
      }
    `,
    danger: css`
      background: ${color.error};
      border: none;
      color: ${color.white};

      &:hover:not(:disabled) {
        background: ${color.errorDark};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.errorBackground};
      }
    `,
    ghost: css`
      background: ${color.neutral100};
      border: none;
      color: ${color.textSecondary};

      &:hover:not(:disabled) {
        background: ${color.neutral200};
        color: ${color.textPrimary};
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px ${color.neutral300};
      }
    `,
    outline: css`
      background: ${color.white};
      border: 1px solid ${color.neutral300};
      color: ${color.textPrimary};

      &:hover:not(:disabled) {
        background: ${color.neutral50};
        border-color: ${color.primary300};
      }

      &:focus-visible {
        border-color: ${color.primary500};
      }
    `,
    primary: css`
      background: ${color.primary500};
      border: none;
      color: ${color.neutral900};

      &:hover:not(:disabled) {
        background: ${color.primary400};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.primary200};
      }
    `,
    secondary: css`
      background: ${color.white};
      border: 1px solid ${color.neutral300};
      color: ${color.textPrimary};

      &:hover:not(:disabled) {
        background: ${color.neutral50};
        border-color: ${color.neutral400};
      }

      &:focus-visible {
        border-color: ${color.primary500};
        box-shadow: 0 0 0 3px ${color.primary100};
      }
    `,
    success: css`
      background: ${color.success};
      border: none;
      color: ${color.white};

      &:hover:not(:disabled) {
        background: ${color.successDark};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.successBackground};
      }
    `,
    warning: css`
      background: ${color.warning};
      border: none;
      color: ${color.neutral900};

      &:hover:not(:disabled) {
        background: ${color.warningDark};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${color.warningBackground};
      }
    `,
  };

  return variants[variant];
};

const normalizeSize = (size: ButtonSize): 'sm' | 'md' | 'lg' => {
  const sizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
    large: 'lg',
    lg: 'lg',
    md: 'md',
    medium: 'md',
    sm: 'sm',
    small: 'sm',
  };
  return sizeMap[size];
};

const getBorderRadius = (buttonShape?: ButtonShape): string => {
  if (buttonShape === 'circle' || buttonShape === 'pill') {
    return shape.full;
  }
  return shape.md;
};

const getSizeStyles = (size: ButtonSize, iconOnly: boolean, buttonShape?: ButtonShape) => {
  const normalizedSize = normalizeSize(size);
  const borderRadius = getBorderRadius(buttonShape);

  if (iconOnly) {
    const iconOnlySizes: Record<'sm' | 'md' | 'lg', ReturnType<typeof css>> = {
      lg: css`
        border-radius: ${borderRadius};
        height: ${spacing.md};
        min-width: ${spacing.md};
        padding: 0;
        width: ${spacing.md};
      `,
      md: css`
        border-radius: ${borderRadius};
        height: ${spacing.md};
        min-width: ${spacing.md};
        padding: 0;
        width: ${spacing.md};
      `,
      sm: css`
        border-radius: ${borderRadius};
        height: ${spacing.md};
        min-width: ${spacing.md};
        padding: 0;
        width: ${spacing.md};
      `,
    };
    return iconOnlySizes[normalizedSize];
  }

  const sizes: Record<'sm' | 'md' | 'lg', ReturnType<typeof css>> = {
    lg: css`
      font-size: ${typography.size.sm};
      min-height: ${spacing.lg};
      padding: ${spacing.xs} ${spacing.md};
    `,
    md: css`
      font-size: ${typography.size.sm};
      min-height: ${spacing.md};
      padding: ${spacing.xs} ${spacing.sm};
    `,
    sm: css`
      font-size: ${typography.size.xs};
      min-height: ${spacing.sm};
      padding: ${spacing.micro} ${spacing.sm};
    `,
  };

  return sizes[normalizedSize];
};

export const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  border-radius: ${({ $shape }) => getBorderRadius($shape)};
  cursor: pointer;
  display: inline-flex;
  font-family: ${typography.family.body};
  font-weight: ${typography.weight.medium};
  gap: ${spacing.xs};
  justify-content: center;
  outline: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $iconOnly, $shape, $size }) => getSizeStyles($size, $iconOnly ?? false, $shape)}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ButtonLoader = styled.span`
  animation: ${spin} 0.6s linear infinite;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  display: inline-block;
  height: ${spacing.sm};
  width: ${spacing.sm};
`;

export const ButtonIcon = styled.span`
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
`;
