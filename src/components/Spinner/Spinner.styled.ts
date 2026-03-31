/**
 * Spinner Styled Components
 *
 * Pure CSS spinner with pulse ring and optional text.
 */

import styled, { keyframes } from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const SIZE_MAP = {
  lg: { ring: '64px', stroke: '4px' },
  md: { ring: '40px', stroke: '3px' },
  sm: { ring: '24px', stroke: '2px' },
} as const;

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  justify-content: center;
`;

export const SpinnerRing = styled.div<{ $color?: string; $size: 'sm' | 'md' | 'lg' }>`
  animation: ${spin} 0.8s linear infinite;
  border: ${({ $size }) => SIZE_MAP[$size].stroke} solid ${c('neutral200')};
  border-radius: 50%;
  border-top-color: ${({ $color }) => $color ?? c('accent500')};
  height: ${({ $size }) => SIZE_MAP[$size].ring};
  width: ${({ $size }) => SIZE_MAP[$size].ring};
`;

export const SpinnerText = styled.span`
  animation: ${pulse} 2s ease-in-out infinite;
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  text-align: center;
`;
