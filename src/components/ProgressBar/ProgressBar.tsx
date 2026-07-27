/**
 * ProgressBar Component
 *
 * Animated progress bar with optional label and percentage.
 * Variants: default (gradient), success (green), warning (orange).
 */

import type { ProgressBarProps } from './ProgressBar.interfaces';

import {
  ProgressContainer,
  ProgressFill,
  ProgressHeader,
  ProgressLabel,
  ProgressPercentage,
  ProgressTrack,
} from './ProgressBar.styled';

export const ProgressBar = ({
  className,
  label,
  max = 100,
  showPercentage = true,
  size = 'medium',
  value,
  valueLabel,
  variant = 'default',
}: ProgressBarProps) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  /* An explicit `valueLabel` wins over the percentage: showing both is never what a caller wants. */
  const readout = valueLabel ?? (showPercentage ? `${percentage}%` : null);

  return (
    <ProgressContainer className={className}>
      {(label || readout !== null) && (
        <ProgressHeader>
          {label && <ProgressLabel>{label}</ProgressLabel>}
          {readout !== null && <ProgressPercentage>{readout}</ProgressPercentage>}
        </ProgressHeader>
      )}
      <ProgressTrack $size={size}>
        <ProgressFill $percentage={percentage} $variant={variant} />
      </ProgressTrack>
    </ProgressContainer>
  );
};
