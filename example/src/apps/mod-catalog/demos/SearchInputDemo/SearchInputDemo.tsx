/**
 * SearchInput: Búsqueda con debounce (useDebounce).
 */

import { useState } from 'react';

import { SearchInput, useDebounce } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoSection } from '../../presentation/components';

export const SearchInputDemo = () => {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  return (
    <DemoSection title='Con debounce'>
      <SearchInput onChange={setSearch} placeholder='Buscar participante…' value={search} />
      <DemoCaption>{`Busca: "${debounced}"`}</DemoCaption>
    </DemoSection>
  );
};
