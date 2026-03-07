/**
 * Spinner Styled Components
 *
 * Pure CSS spinner with pulse ring and optional text.
 */

import styled, { keyframes } from 'styled-components';

import { color, spacing, typography } from '../../tokens';

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
  gap: ${spacing.sm};
  justify-content: center;
`;

export const SpinnerRing = styled.div<{ $color?: string; $size: 'sm' | 'md' | 'lg' }>`
  animation: ${spin} 0.8s linear infinite;
  border: ${({ $size }) => SIZE_MAP[$size].stroke} solid ${color.neutral200};
  border-radius: 50%;
  border-top-color: ${({ $color }) => $color ?? color.accent500};
  height: ${({ $size }) => SIZE_MAP[$size].ring};
  width: ${({ $size }) => SIZE_MAP[$size].ring};
`;

export const SpinnerText = styled.span`
  animation: ${pulse} 2s ease-in-out infinite;
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
  text-align: center;
`;
