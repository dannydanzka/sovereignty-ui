/**
 * Spacer
 *
 * Flexible spacing utility component.
 * As wrapper (with children): applies margin/padding around content.
 * As standalone (no children): renders an empty block with explicit dimensions.
 */

import type { SpacerProps } from './Spacer.interfaces';

import { StyledSpacer } from './Spacer.styled';

export const Spacer = ({
  children,
  className,
  horizontal,
  mode = 'margin',
  vertical,
}: SpacerProps) => {
  const isWrapper = children !== undefined;

  return (
    <StyledSpacer
      $horizontal={horizontal}
      $isWrapper={isWrapper}
      $mode={mode}
      $vertical={vertical}
      className={className}
      data-testid='spacer'
    >
      {children}
    </StyledSpacer>
  );
};
