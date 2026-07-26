/** DescriptionList props. */

import type { ReactNode } from 'react';

export type DescriptionListColumns = 1 | 2 | 3 | 4 | 'auto';

export interface DescriptionListItem {
  /** Skip the row entirely when there is nothing to show. */
  hidden?: boolean;
  label: string;
  value: ReactNode;
}

export interface DescriptionListProps {
  className?: string;
  /** `auto` fits as many ~200px columns as the container allows. Default `auto`. */
  columns?: DescriptionListColumns;
  items: readonly DescriptionListItem[];
}

export interface StyledDescriptionListProps {
  $columns: DescriptionListColumns;
}
