/**
 * InlineIcon Component Interfaces
 */

import type { ReactNode } from 'react';

export type InlineIconPosition = 'left' | 'top';

export interface InlineIconProps {
  children: ReactNode;
  className?: string;
  position?: InlineIconPosition;
  tight?: boolean;
}

export interface StyledInlineIconProps {
  $position: InlineIconPosition;
  $tight: boolean;
}
