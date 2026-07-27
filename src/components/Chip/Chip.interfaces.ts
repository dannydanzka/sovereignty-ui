/**
 * Chip Component Interfaces
 */

import type { ReactNode } from 'react';

export type ChipSize = 'md' | 'sm';

export interface ChipProps {
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  /** The visible text. Keep it short — a chip is a filter, not a sentence. */
  label: string;
  /**
   * Hands back the chip's `value`, not the DOM event — the same contract as the library's fields.
   * One handler can therefore serve a whole row of chips; a curried factory per option is not needed.
   */
  onSelect: (value: string) => void;
  selected?: boolean;
  size?: ChipSize;
  /** What `onSelect` receives. Distinct from `label` so the caller can filter on a stable key. */
  value: string;
}

export interface StyledChipProps {
  $selected: boolean;
  $size: ChipSize;
}
