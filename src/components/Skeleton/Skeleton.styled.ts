/**
 * Skeleton Styled Components
 *
 * Shimmer animation placeholder for loading states.
 */

import styled, { keyframes } from 'styled-components';

import { color, shape, spacing } from '../../tokens';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const VARIANT_DEFAULTS = {
  circular: { borderRadius: '50%', height: spacing.xl, width: spacing.xl },
  rectangular: { borderRadius: shape.md, height: '120px', width: '100%' },
  text: { borderRadius: shape.sm, height: spacing.sm, width: '100%' },
} as const;

export const SkeletonBox = styled.div<{
  $borderRadius?: string;
  $height?: string;
  $variant: 'text' | 'circular' | 'rectangular';
  $width?: string;
}>`
  animation: ${shimmer} 1.5s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    ${color.neutral100} 25%,
    ${color.neutral50} 50%,
    ${color.neutral100} 75%
  );
  background-size: 200% 100%;
  border-radius: ${({ $borderRadius, $variant }) =>
    $borderRadius ?? VARIANT_DEFAULTS[$variant].borderRadius};
  height: ${({ $height, $variant }) => $height ?? VARIANT_DEFAULTS[$variant].height};
  width: ${({ $variant, $width }) => $width ?? VARIANT_DEFAULTS[$variant].width};
`;
