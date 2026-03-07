/** Textarea component props */
export interface TextareaProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  maxLength?: number;
  name?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  showCount?: boolean;
  value?: string;
}
