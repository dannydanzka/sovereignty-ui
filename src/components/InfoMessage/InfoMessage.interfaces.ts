/**
 * InfoMessage Interfaces
 */

import type { ReactNode } from 'react';

export type InfoMessageVariant = 'info' | 'warning' | 'success' | 'error';

export interface InfoMessageProps {
  children: ReactNode;
  className?: string;
  variant?: InfoMessageVariant;
}

export interface StyledInfoMessageProps {
  $variant: InfoMessageVariant;
}
