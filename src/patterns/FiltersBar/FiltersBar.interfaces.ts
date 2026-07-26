/** FiltersBar props. */

import type { ReactNode } from 'react';

import type { SelectOption } from '../../components/Select';

export interface FiltersBarProps {
  children?: ReactNode;
  className?: string;
}

export interface FiltersBarSearchProps {
  /** Defaults to `filters-search`; set it when a screen has more than one search box. */
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export interface FiltersBarSelectProps {
  className?: string;
  id?: string;
  /** Readonly so callers can pass their `as const` option lists straight in. */
  options: readonly SelectOption[];
  /** Empty first entry. Omit when the option list already carries an "All" entry. */
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}
