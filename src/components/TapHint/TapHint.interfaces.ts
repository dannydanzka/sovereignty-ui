/**
 * TapHint Component Interfaces
 *
 * Pulsing icon overlay that hints "click here" on interactive elements.
 */

export type TapHintPosition = 'bottom-right' | 'center' | 'top-right';

export interface TapHintProps {
  autoHideMs?: number;
  position?: TapHintPosition;
  size?: number;
}

export interface StyledTapHintProps {
  $position: TapHintPosition;
  $size: number;
}
