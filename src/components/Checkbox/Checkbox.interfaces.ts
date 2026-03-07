/** Checkbox component props */
export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
}
