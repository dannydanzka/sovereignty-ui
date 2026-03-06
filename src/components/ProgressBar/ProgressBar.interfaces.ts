/**
 * ProgressBar Component Interfaces
 */

export interface ProgressBarProps {
  className?: string;
  label?: string;
  max?: number;
  showPercentage?: boolean;
  size?: 'large' | 'medium' | 'small';
  value: number;
  variant?: 'default' | 'success' | 'warning';
}
