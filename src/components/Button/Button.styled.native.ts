/**
 * Button Styled Components — React Native resolution
 *
 * Built on the Pressable primitive (TouchableOpacity → maps onClick to onPress).
 * Native View/Text do not cascade color, so the button surface carries the
 * background/border and ButtonLabel carries the per-variant text color. No
 * hover/focus/keyframes on native; the loading spinner is an ActivityIndicator.
 */

import { ActivityIndicator } from 'react-native';
import styled, { css } from 'styled-components/native';

import type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  StyledButtonProps,
} from './Button.interfaces';
import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

const VARIANT_COLORS: Record<ButtonVariant, { background: string; border?: string; text: string }> =
  {
    accent: { background: c('accent500'), text: c('white') },
    brand: { background: c('accent500'), text: c('white') },
    'brand-ghost': { background: 'transparent', text: c('accent500') },
    'brand-outline': { background: c('white'), border: c('accent500'), text: c('accent500') },
    danger: { background: c('error'), text: c('white') },
    ghost: { background: c('neutral100'), text: c('textSecondary') },
    outline: { background: c('white'), border: c('neutral300'), text: c('textPrimary') },
    primary: { background: c('primary500'), text: c('neutral900') },
    secondary: { background: c('white'), border: c('neutral300'), text: c('textPrimary') },
    success: { background: c('success'), text: c('white') },
    warning: { background: c('warning'), text: c('neutral900') },
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

const getBorderRadius = (buttonShape?: ButtonShape): string =>
  buttonShape === 'circle' || buttonShape === 'pill' ? sh('full') : sh('md');

const getVariantStyles = (variant: ButtonVariant) => {
  const { background, border } = VARIANT_COLORS[variant];
  return css`
    background-color: ${background};
    ${border
      ? css`
          border-color: ${border};
          border-width: 1px;
        `
      : ''}
  `;
};

const getSizeStyles = (size: ButtonSize, iconOnly: boolean) => {
  const normalized = normalizeSize(size);

  if (iconOnly) {
    return css`
      height: ${s('md')};
      min-width: ${s('md')};
      width: ${s('md')};
    `;
  }

  switch (normalized) {
    case 'lg':
      return css`
        min-height: ${s('lg')};
        padding: ${s('xs')} ${s('md')};
      `;
    case 'sm':
      return css`
        min-height: ${s('sm')};
        padding: ${s('micro')} ${s('sm')};
      `;
    case 'md':
    default:
      return css`
        min-height: ${s('md')};
        padding: ${s('xs')} ${s('sm')};
      `;
  }
};

export const StyledButton = styled(Pressable)<StyledButtonProps>`
  align-items: center;
  border-radius: ${({ $shape }) => getBorderRadius($shape)};
  flex-direction: row;
  gap: ${s('xs')};
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $iconOnly, $size }) => getSizeStyles($size, $iconOnly ?? false)}
  ${({ $fullWidth }) => ($fullWidth ? 'width: 100%;' : '')}
`;

export const ButtonLabel = styled(Span)<StyledButtonProps>`
  color: ${({ $variant }) => VARIANT_COLORS[$variant].text};
  font-family: ${tf('body')};
  font-size: ${({ $size }) => (normalizeSize($size) === 'sm' ? ts('xs') : ts('sm'))};
  font-weight: ${tw('medium')};
`;

export const ButtonIcon = styled(Div)`
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
`;

export const ButtonLoader = styled(ActivityIndicator).attrs({
  size: 'small',
})``;
