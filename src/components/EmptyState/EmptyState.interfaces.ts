/**
 * EmptyState Interfaces
 */

import type { ReactNode } from 'react';

/**
 * `block` (default) is the full empty panel: icon, title, message, action. `inline` is a single line
 * of muted text where a table body or a list would be — the case consumers hand-rolled as an
 * `EmptyMessage` paragraph because the panel was too heavy for one row.
 */
export type EmptyStateVariant = 'block' | 'inline';

export interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
  message?: string;
  title?: string;
  variant?: EmptyStateVariant;
}

export interface StyledEmptyStateProps {
  $variant: EmptyStateVariant;
}
