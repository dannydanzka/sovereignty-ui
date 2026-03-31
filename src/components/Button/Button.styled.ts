/**
 * Button Styled Components
 *
 * Unified styles for all button variants:
 * - Semantic: primary, secondary, success, warning, danger
 * - Structural: outline, ghost
 * - Accent: accent, brand, brand-outline, brand-ghost
 * - Modes: iconOnly, fullWidth
 */

import styled, { css, keyframes } from 'styled-components';

import type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  StyledButtonProps,
} from './Button.interfaces';
import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const getVariantStyles = (variant: ButtonVariant) => {
  const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
    accent: css`
      background: ${c('accent500')};
      border: none;
      color: ${c('white')};

      &:hover:not(:disabled) {
        background: ${c('accent600')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('accent200')};
      }
    `,
    brand: css`
      background: ${c('accent500')};
      border: none;
      color: ${c('white')};

      &:hover:not(:disabled) {
        background: ${c('accent700')};
        transform: translateY(-1px);
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('accent200')};
      }
    `,
    'brand-ghost': css`
      background: transparent;
      border: none;
      color: ${c('accent500')};

      &:hover:not(:disabled) {
        color: ${c('accent700')};
        text-decoration: underline;
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px ${c('accent200')};
      }
    `,
    'brand-outline': css`
      background: ${c('white')};
      border: 2px solid ${c('accent500')};
      color: ${c('accent500')};

      &:hover:not(:disabled) {
        background: ${c('accent500')};
        color: ${c('white')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('accent200')};
      }
    `,
    danger: css`
      background: ${c('error')};
      border: none;
      color: ${c('white')};

      &:hover:not(:disabled) {
        background: ${c('errorDark')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('errorBackground')};
      }
    `,
    ghost: css`
      background: ${c('neutral100')};
      border: none;
      color: ${c('textSecondary')};

      &:hover:not(:disabled) {
        background: ${c('neutral200')};
        color: ${c('textPrimary')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px ${c('neutral300')};
      }
    `,
    outline: css`
      background: ${c('white')};
      border: 1px solid ${c('neutral300')};
      color: ${c('textPrimary')};

      &:hover:not(:disabled) {
        background: ${c('neutral50')};
        border-color: ${c('primary300')};
      }

      &:focus-visible {
        border-color: ${c('primary500')};
      }
    `,
    primary: css`
      background: ${c('primary500')};
      border: none;
      color: ${c('neutral900')};

      &:hover:not(:disabled) {
        background: ${c('primary400')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('primary200')};
      }
    `,
    secondary: css`
      background: ${c('white')};
      border: 1px solid ${c('neutral300')};
      color: ${c('textPrimary')};

      &:hover:not(:disabled) {
        background: ${c('neutral50')};
        border-color: ${c('neutral400')};
      }

      &:focus-visible {
        border-color: ${c('primary500')};
        box-shadow: 0 0 0 3px ${c('primary100')};
      }
    `,
    success: css`
      background: ${c('success')};
      border: none;
      color: ${c('white')};

      &:hover:not(:disabled) {
        background: ${c('successDark')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('successBackground')};
      }
    `,
    warning: css`
      background: ${c('warning')};
      border: none;
      color: ${c('neutral900')};

      &:hover:not(:disabled) {
        background: ${c('warningDark')};
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px ${c('warningBackground')};
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
    return sh('full');
  }
  return sh('md');
};

const getSizeStyles = (size: ButtonSize, iconOnly: boolean, buttonShape?: ButtonShape) => {
  const normalizedSize = normalizeSize(size);
  const borderRadius = getBorderRadius(buttonShape);

  if (iconOnly) {
    const iconOnlySizes: Record<'sm' | 'md' | 'lg', ReturnType<typeof css>> = {
      lg: css`
        border-radius: ${borderRadius};
        height: ${s('md')};
        min-width: ${s('md')};
        padding: 0;
        width: ${s('md')};
      `,
      md: css`
        border-radius: ${borderRadius};
        height: ${s('md')};
        min-width: ${s('md')};
        padding: 0;
        width: ${s('md')};
      `,
      sm: css`
        border-radius: ${borderRadius};
        height: ${s('md')};
        min-width: ${s('md')};
        padding: 0;
        width: ${s('md')};
      `,
    };
    return iconOnlySizes[normalizedSize];
  }

  const sizes: Record<'sm' | 'md' | 'lg', ReturnType<typeof css>> = {
    lg: css`
      font-size: ${ts('sm')};
      min-height: ${s('lg')};
      padding: ${s('xs')} ${s('md')};
    `,
    md: css`
      font-size: ${ts('sm')};
      min-height: ${s('md')};
      padding: ${s('xs')} ${s('sm')};
    `,
    sm: css`
      font-size: ${ts('xs')};
      min-height: ${s('sm')};
      padding: ${s('micro')} ${s('sm')};
    `,
  };

  return sizes[normalizedSize];
};

export const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  border-radius: ${({ $shape }) => getBorderRadius($shape)};
  cursor: pointer;
  display: inline-flex;
  font-family: ${tf('body')};
  font-weight: ${tw('medium')};
  gap: ${s('xs')};
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
  height: ${s('sm')};
  width: ${s('sm')};
`;

export const ButtonIcon = styled.span`
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
`;
