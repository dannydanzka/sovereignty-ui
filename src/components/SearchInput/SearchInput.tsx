/**
 * SearchInput
 */

import type { SearchInputProps } from './SearchInput.interfaces';

import { FilterBar, StyledSearchInput } from './SearchInput.styled';

export const SearchInput = ({
  children,
  className,
  onChange,
  placeholder = 'Search...',
  value,
}: SearchInputProps) => (
  <FilterBar className={className}>
    <StyledSearchInput
      placeholder={placeholder}
      type='text'
      value={value}
      onValueChange={onChange}
    />
    {children}
  </FilterBar>
);
