/**
 * ProgressBar Styled Components
 *
 * Animated progress bar with gradient fill.
 */

import styled, { keyframes } from 'styled-components';

import { brandColor, color, shape, spacing, typography } from '../../tokens';

const fillAnimation = keyframes`
  from {
    width: 0;
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.micro};
  width: 100%;
`;

export const ProgressHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const ProgressLabel = styled.span`
  color: ${brandColor.landingTextGray};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;

export const ProgressPercentage = styled.span`
  color: ${brandColor.landingPinkVibrant};
  font-family: ${typography.family.display};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.bold};
`;

export const ProgressTrack = styled.div<{ $size: 'large' | 'medium' | 'small' }>`
  background: ${color.neutral200};
  border-radius: ${shape.full};
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
        return color.success;
      case 'warning':
        return color.warning;
      case 'default':
        return `linear-gradient(90deg, ${brandColor.landingPinkVibrant}, ${color.tertiary300})`;
    }
  }};
  border-radius: ${shape.full};
  height: 100%;
  transition: width 0.3s ease-out;
  width: ${({ $percentage }) => `${Math.min(100, Math.max(0, $percentage))}%`};
`;
