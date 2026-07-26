/** FormGrid props. */

import type { ReactNode } from 'react';

export type FormGridColumns = 1 | 2 | 3;

export interface FormGridProps {
  children?: ReactNode;
  className?: string;
  /** Columns on wide viewports; always 1 below `sm`. Default 2. */
  columns?: FormGridColumns;
}

export interface FormGridFullProps {
  children?: ReactNode;
  className?: string;
}

export interface StyledFormGridProps {
  $columns: FormGridColumns;
}
