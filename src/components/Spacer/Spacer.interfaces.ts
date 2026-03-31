/**
 * Spacer Interfaces
 */

import type { ReactNode } from 'react';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface SpacerProps {
  children?: ReactNode;
  className?: string;
  horizontal?: SpacerSize;
  mode?: 'margin' | 'padding';
  vertical?: SpacerSize;
}

export interface StyledSpacerProps {
  $horizontal?: SpacerSize;
  $isWrapper: boolean;
  $mode: 'margin' | 'padding';
  $vertical?: SpacerSize;
}
