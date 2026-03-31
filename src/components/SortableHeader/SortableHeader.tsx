/**
 * SortableHeader
 */

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import type { SortableHeaderProps } from './SortableHeader.interfaces';

import { Header, SortIcon } from './SortableHeader.styled';

export const SortableHeader = ({
  active = false,
  className,
  direction,
  label,
  onSort,
  width,
}: SortableHeaderProps) => (
  <Header $active={active} $width={width} className={className} onClick={onSort}>
    {label}
    <SortIcon>
      {!active && <ArrowUpDown size={12} />}
      {active && direction === 'asc' && <ArrowUp size={12} />}
      {active && direction === 'desc' && <ArrowDown size={12} />}
    </SortIcon>
  </Header>
);
