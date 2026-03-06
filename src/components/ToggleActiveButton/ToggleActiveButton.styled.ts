/**
 * ToggleActiveButton Styled Components
 *
 * Colors: muted green (inactive) / muted red (active) / yellow (loading).
 * Hover: brightness filter for subtle feedback.
 * Spinner: rotating icon via keyframes animation.
 */

import styled, { keyframes } from 'styled-components';

import { color, shape, spacing } from '../../tokens';
import type { StyledToggleButtonProps } from './ToggleActiveButton.interfaces';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const buttonSize = ($size: 'sm' | 'md') => ($size === 'sm' ? spacing.md : spacing.lg);

export const StyledToggleButton = styled.button<StyledToggleButtonProps>`
  align-items: center;
  background: ${({ $isActive, $isLoading }) => {
    if ($isLoading) return color.warningBackground;
    return $isActive ? color.errorBackground : color.successBackground;
  }};
  border: none;
  border-radius: ${({ $shape }) => ($shape === 'circle' ? shape.full : shape.md)};
  color: ${({ $isActive, $isLoading }) => {
    if ($isLoading) return color.warningDark;
    return $isActive ? color.errorDark : color.successDark;
  }};
  cursor: ${({ $isLoading }) => ($isLoading ? 'wait' : 'pointer')};
  display: inline-flex;
  height: ${({ $size }) => buttonSize($size)};
  justify-content: center;
  min-width: ${({ $size }) => buttonSize($size)};
  padding: 0;
  transition: all 0.2s ease;
  width: ${({ $size }) => buttonSize($size)};

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }
`;

export const SpinnerIcon = styled.span`
  animation: ${spin} 1s linear infinite;
  display: inline-flex;
`;
