/** The filter dropdown of a filters bar — the shared `Select`, options by prop, never `<option>`. */

import type { FiltersBarSelectProps } from './FiltersBar.interfaces';
import { Select } from '../../components/Select';

export const FiltersBarSelect = ({
  className,
  id = 'filters-select',
  onChange,
  options,
  placeholder,
  value,
}: FiltersBarSelectProps) => (
  <Select
    className={className}
    id={id}
    name={id}
    options={[...options]}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);
