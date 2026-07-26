/**
 * Input Component Interfaces
 */

export type InputType = 'email' | 'number' | 'password' | 'tel' | 'text';

export interface InputProps {
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  hidePasswordLabel?: string;
  id: string;
  label?: string;
  /** Hard cap on the value length (native `maxLength`). Also drives the counter. */
  maxLength?: number;
  name: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Render a `current/max` counter under the field. Requires `maxLength`. */
  showCount?: boolean;
  showPasswordLabel?: string;
  type?: InputType;
  value?: string;
}

export interface StyledInputWrapperProps {
  $fullWidth?: boolean;
}

export interface StyledInputProps {
  $hasError?: boolean;
  $hasToggle?: boolean;
}
