/**
 * StatsCard Styled Components
 *
 * Card for displaying stats: value, label, optional icon and sublabel.
 */

import styled from 'styled-components';

import { brandColor, color, elevation, shape, spacing, typography } from '../../tokens';

export const CardContainer = styled.div<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `linear-gradient(135deg, ${brandColor.landingPinkVibrant}, ${color.tertiary300})`;
      case 'success':
        return color.successLight;
      case 'warning':
        return color.warningLight;
      case 'default':
        return color.white;
    }
  }};
  border-radius: ${shape.lg};
  box-shadow: ${elevation.sm};
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  padding: ${spacing.md};
`;

export const CardIcon = styled.div<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  align-items: center;
  background: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : brandColor.landingBgYellow};
  border-radius: ${shape.full};
  color: ${({ $variant }) =>
    $variant === 'primary' ? color.white : brandColor.landingPinkVibrant};
  display: flex;
  height: ${spacing.xl};
  justify-content: center;
  width: ${spacing.xl};

  svg {
    height: ${spacing.sm};
    width: ${spacing.sm};
  }
`;

export const CardValue = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) => ($variant === 'primary' ? color.white : brandColor.landingBlueDark)};
  font-family: ${typography.family.display};
  font-size: ${typography.size['3xl']};
  font-weight: ${typography.weight.bold};
`;

export const CardLabel = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.9)' : brandColor.landingTextGray};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;

export const CardSublabel = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.7)' : color.neutral400};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;
