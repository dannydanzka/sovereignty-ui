/**
 * AppFooter Pattern Interfaces
 */

import type { ReactNode } from 'react';

export interface AppFooterColumn {
  content: ReactNode;
  title?: string;
}

export interface AppFooterProps {
  bottomSlot?: ReactNode;
  brandSlot?: ReactNode;
  className?: string;
  columns?: AppFooterColumn[];
  copyright?: string;
  socialSlot?: ReactNode;
}
