/** Toggle component props */
export interface ToggleProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
}
