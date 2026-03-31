/**
 * Dropdown Interfaces
 */

import type { ReactNode } from 'react';

export type DropdownPosition = 'top' | 'bottom';

export interface DropdownOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface DropdownProps {
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  position?: DropdownPosition;
  value: string;
}

export interface StyledDropdownMenuProps {
  $position: DropdownPosition;
}

export interface StyledDropdownItemProps {
  $disabled?: boolean;
  $selected?: boolean;
}
