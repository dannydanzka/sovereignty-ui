/**
 * Switch Interfaces
 */

import type { ChangeEvent } from 'react';

export interface SwitchProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface StyledSwitchWrapperProps {
  $disabled?: boolean;
}

export interface StyledSwitchTrackProps {
  $checked?: boolean;
  $disabled?: boolean;
}
