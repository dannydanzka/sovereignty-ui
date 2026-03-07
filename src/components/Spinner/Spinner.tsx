/**
 * Spinner Component
 *
 * Pure CSS loading indicator with optional text.
 * Agnostic — no logo, no framework dependencies.
 */

import type { SpinnerProps } from './Spinner.interfaces';

import { SpinnerContainer, SpinnerRing, SpinnerText } from './Spinner.styled';

export const Spinner = ({ className, color, size = 'md', text }: SpinnerProps) => (
  <SpinnerContainer className={className} data-testid='spinner'>
    <SpinnerRing $color={color} $size={size} />
    {text && <SpinnerText>{text}</SpinnerText>}
  </SpinnerContainer>
);
