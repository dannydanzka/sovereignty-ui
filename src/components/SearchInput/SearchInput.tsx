/**
 * SearchInput
 */

import { type ChangeEvent, useCallback } from 'react';

import type { SearchInputProps } from './SearchInput.interfaces';

import { FilterBar, StyledSearchInput } from './SearchInput.styled';

export const SearchInput = ({
  children,
  className,
  onChange,
  placeholder = 'Search...',
  value,
}: SearchInputProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <FilterBar className={className}>
      <StyledSearchInput
        placeholder={placeholder}
        type='text'
        value={value}
        onChange={handleChange}
      />
      {children}
    </FilterBar>
  );
};
