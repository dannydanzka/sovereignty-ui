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
  name: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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
