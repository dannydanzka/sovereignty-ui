/** The search box of a filters bar — the shared `Input`, so it matches every form field. */

import type { FiltersBarSearchProps } from './FiltersBar.interfaces';
import { Input } from '../../components/Input';

export const FiltersBarSearch = ({
  id = 'filters-search',
  onChange,
  placeholder,
  value,
}: FiltersBarSearchProps) => (
  <Input fullWidth id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} />
);
