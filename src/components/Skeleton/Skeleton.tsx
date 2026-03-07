/**
 * Skeleton Component
 *
 * Shimmer placeholder for loading states.
 * Supports text, circular, and rectangular variants.
 */

import type { SkeletonProps } from './Skeleton.interfaces';

import { SkeletonBox } from './Skeleton.styled';

export const Skeleton = ({
  borderRadius,
  className,
  height,
  variant = 'text',
  width,
}: SkeletonProps) => (
  <SkeletonBox
    $borderRadius={borderRadius}
    $height={height}
    $variant={variant}
    $width={width}
    className={className}
    data-testid='skeleton'
  />
);
