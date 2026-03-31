/**
 * ProgressBar Styled Components
 *
 * Animated progress bar with gradient fill.
 */

import styled, { keyframes } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

const fillAnimation = keyframes`
  from {
    width: 0;
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const ProgressHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const ProgressLabel = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const ProgressPercentage = styled.span`
  color: ${c('accent500')};
  font-family: ${tf('display')};
  font-size: ${ts('sm')};
  font-weight: ${tw('bold')};
`;

export const ProgressTrack = styled.div<{ $size: 'large' | 'medium' | 'small' }>`
  background: ${c('neutral200')};
  border-radius: ${sh('full')};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small':
        return '6px';
      case 'medium':
        return '8px';
      case 'large':
        return '12px';
    }
  }};
  overflow: hidden;
  width: 100%;
`;

export const ProgressFill = styled.div<{
  $percentage: number;
  $variant: 'default' | 'success' | 'warning';
}>`
  animation: ${fillAnimation} 0.6s ease-out forwards;
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return c('success');
      case 'warning':
        return c('warning');
      case 'default':
        return `linear-gradient(90deg, ${c('accent500')}, ${c('tertiary300')})`;
    }
  }};
  border-radius: ${sh('full')};
  height: 100%;
  transition: width 0.3s ease-out;
  width: ${({ $percentage }) => `${Math.min(100, Math.max(0, $percentage))}%`};
`;
