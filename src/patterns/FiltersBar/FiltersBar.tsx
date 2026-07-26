/**
 * FiltersBar
 *
 * The search + filter row above a `DataTable`. The bar owns the responsive grid; the CONTROLS are
 * `Input` and `Select` (`FiltersBar.Search` / `FiltersBar.Select`), so a filter field looks and
 * behaves exactly like a form field and every list screen shares one search box and one dropdown.
 *
 * Without this, each screen grows its own `styled.input` + `styled.select` + `styled.option` — the
 * most common way a product ends up with five slightly different search boxes.
 */

import type { FiltersBarProps } from './FiltersBar.interfaces';
import { FiltersBarSearch } from './FiltersBarSearch';
import { FiltersBarSelect } from './FiltersBarSelect';

import { FiltersBarWrapper } from './FiltersBar.styled';

export const FiltersBar = ({ children, className }: FiltersBarProps) => (
  <FiltersBarWrapper className={className}>{children}</FiltersBarWrapper>
);

FiltersBar.Search = FiltersBarSearch;
FiltersBar.Select = FiltersBarSelect;
