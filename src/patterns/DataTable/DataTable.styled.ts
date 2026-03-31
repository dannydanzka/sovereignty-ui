/**
 * DataTable Styled Components
 */

import styled, { css, keyframes } from 'styled-components';

import { c, s, sh, tf, ts, tt, tw } from '../../tokens/css-variables';

export const DataTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  width: 100%;
`;

export const DataTableToolbar = styled.div`
  display: flex;
  gap: ${s('sm')};
  justify-content: flex-end;
`;

export const DataTableSearchInput = styled.input`
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  max-width: 20rem;
  outline: none;
  padding: ${s('xs')} ${s('sm')};
  transition: border-color 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${c('textDisabled')};
  }

  &:focus {
    border-color: ${c('primary500')};
    box-shadow: 0 0 0 3px ${c('primaryFocusShadow')};
  }
`;

export const DataTableContainer = styled.div`
  border: 1px solid ${c('border')};
  border-radius: ${sh('lg')};
  overflow-x: auto;
  width: 100%;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  min-width: 100%;
  width: 100%;
`;

export const TableHead = styled.thead`
  background-color: ${c('neutral50')};
`;

export const TableHeadRow = styled.tr`
  border-bottom: 1px solid ${c('border')};
`;

export const TableHeadCell = styled.th<{
  $align: 'center' | 'left' | 'right';
  $sortable: boolean;
  $width?: string;
}>`
  color: ${c('textSecondary')};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  letter-spacing: ${tt('wide')};
  padding: ${s('xs')} ${s('sm')};
  text-align: ${({ $align }) => $align};
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  width: ${({ $width }) => $width ?? 'auto'};

  ${({ $sortable }) =>
    $sortable &&
    css`
      &:hover {
        color: ${c('textPrimary')};
      }
    `}
`;

export const TableHeadCellContent = styled.span`
  align-items: center;
  display: inline-flex;
  gap: ${s('micro')};
`;

export const SortIcon = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? c('primary500') : c('textDisabled'))};
  display: inline-flex;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${c('borderLight')};
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${c('neutral50')};
  }
`;

export const TableCell = styled.td<{ $align: 'center' | 'left' | 'right' }>`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  padding: ${s('xs')} ${s('sm')};
  text-align: ${({ $align }) => $align};
`;

export const TableEmptyRow = styled.tr``;

export const TableEmptyCell = styled.td`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  padding: ${s('xl')} ${s('sm')};
  text-align: center;
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const TableLoadingCell = styled.td`
  padding: ${s('xs')} ${s('sm')};
`;

export const TableLoadingBar = styled.div`
  animation: ${shimmer} 1.5s infinite;
  background: linear-gradient(
    90deg,
    ${c('neutral50')} 25%,
    ${c('neutral100')} 50%,
    ${c('neutral50')} 75%
  );
  background-size: 200% 100%;
  border-radius: ${sh('sm')};
  height: 1rem;
  width: 100%;
`;

export const DataTableFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${s('xs')};
`;
