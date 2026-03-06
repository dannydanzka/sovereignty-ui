/**
 * ToggleActiveButton Interfaces
 *
 * Admin icon button for toggling entity active/inactive status.
 * Shows Power icon (active/inactive states) with spinning Loader2 while loading.
 */

export interface ToggleActiveButtonProps {
  isActive: boolean;
  isLoading?: boolean;
  onClick: () => void;
  shape?: 'circle' | 'square';
  size?: 'md' | 'sm';
  title?: string;
}

export interface StyledToggleButtonProps {
  $isActive: boolean;
  $isLoading: boolean;
  $shape: 'circle' | 'square';
  $size: 'md' | 'sm';
}
