/**
 * SortableHeader Interfaces
 */

export interface SortableHeaderProps {
  active?: boolean;
  className?: string;
  direction?: 'asc' | 'desc';
  label: string;
  onSort: () => void;
  sortKey: string;
  width?: string;
}

export interface StyledSortableHeaderProps {
  $active?: boolean;
  $width?: string;
}
