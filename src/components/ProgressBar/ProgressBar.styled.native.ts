/**
 * ProgressBar Styled Components — React Native resolution
 *
 * Same structure on Div/Span primitives. No keyframes/transition on native, and
 * the default gradient fill becomes a solid accent color (no CSS gradients on RN).
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Span } from '../../primitives';

export const ProgressContainer = styled(Div)`
  gap: ${s('micro')};
  width: 100%;
`;

export const ProgressHeader = styled(Div)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const ProgressLabel = styled(Span)`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const ProgressPercentage = styled(Span)`
  color: ${c('accent500')};
  font-family: ${tf('display')};
  font-size: ${ts('sm')};
  font-weight: ${tw('bold')};
`;

export const ProgressTrack = styled(Div)<{ $size: 'large' | 'medium' | 'small' }>`
  background-color: ${c('neutral200')};
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

export const ProgressFill = styled(Div)<{
  $percentage: number;
  $variant: 'default' | 'success' | 'warning';
}>`
  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return c('success');
      case 'warning':
        return c('warning');
      case 'default':
        return c('accent500');
    }
  }};
  border-radius: ${sh('full')};
  height: 100%;
  width: ${({ $percentage }) => `${Math.min(100, Math.max(0, $percentage))}%`};
`;
