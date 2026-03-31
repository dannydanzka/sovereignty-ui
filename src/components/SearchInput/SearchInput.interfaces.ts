/**
 * SearchInput Interfaces
 */

import type { ReactNode } from 'react';

export interface SearchInputProps {
  children?: ReactNode;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}
