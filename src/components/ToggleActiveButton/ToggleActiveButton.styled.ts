/**
 * ToggleActiveButton Styled Components
 *
 * Colors: muted green (inactive) / muted red (active) / yellow (loading).
 * Hover: brightness filter for subtle feedback.
 * Spinner: rotating icon via keyframes animation.
 */

import styled, { keyframes } from 'styled-components';

import { c, s, sh } from '../../tokens/css-variables';
import type { StyledToggleButtonProps } from './ToggleActiveButton.interfaces';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const buttonSize = ($size: 'sm' | 'md') => ($size === 'sm' ? s('md') : s('lg'));

export const StyledToggleButton = styled.button<StyledToggleButtonProps>`
  align-items: center;
  background: ${({ $isActive, $isLoading }) => {
    if ($isLoading) return c('warningBackground');
    return $isActive ? c('errorBackground') : c('successBackground');
  }};
  border: none;
  border-radius: ${({ $shape }) => ($shape === 'circle' ? sh('full') : sh('md'))};
  color: ${({ $isActive, $isLoading }) => {
    if ($isLoading) return c('warningDark');
    return $isActive ? c('errorDark') : c('successDark');
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
