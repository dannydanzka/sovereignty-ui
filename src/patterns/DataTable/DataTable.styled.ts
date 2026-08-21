/**
 * DataTable Styled Components
 */

import styled, { css, keyframes } from 'styled-components';

import { c, s, sh, tf, ts, tt, tw } from '../../tokens/css-variables';
import type { DataTableHideBelow } from './DataTable.interfaces';
import { layout } from '../../tokens';

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

/**
 * Hide a cell below a breakpoint. `display: none` rather than a width of zero: a collapsed cell
 * still takes its borders and padding, which is how "hidden" columns keep squeezing the visible ones.
 */
const hiddenBelow = ($hideBelow?: DataTableHideBelow) =>
  $hideBelow
    ? css`
        @media (max-width: ${layout.breakpoint[$hideBelow]}) {
          display: none;
        }
      `
    : null;

/**
 * Pinned while the container scrolls sideways. The background is not decoration — without it the
 * scrolling cells show through the pinned one, and the `z-index` keeps it above them.
 */
const pinnedLeft = ($stickyLeft: number | undefined, background: string) =>
  $stickyLeft === undefined
    ? null
    : css`
        background-color: ${background};
        left: ${$stickyLeft}px;
        position: sticky;
        z-index: 1;
      `;

export const TableHeadCell = styled.th<{
  $align: 'center' | 'left' | 'right';
  $hideBelow?: DataTableHideBelow;
  $minWidth?: string;
  $sortable: boolean;
  $stickyLeft?: number;
  $width?: string;
}>`
  color: ${c('textSecondary')};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  letter-spacing: ${tt('wide')};
  min-width: ${({ $minWidth }) => $minWidth ?? 'auto'};
  padding: ${s('xs')} ${s('sm')};
  text-align: ${({ $align }) => $align};
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  width: ${({ $width }) => $width ?? 'auto'};

  /* The head is the one place the sticky background must match the head's own fill, not the row's. */
  ${({ $stickyLeft }) => pinnedLeft($stickyLeft, c('neutral50'))}
  ${({ $hideBelow }) => hiddenBelow($hideBelow)}

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

export const TableCell = styled.td<{
  $align: 'center' | 'left' | 'right';
  $hideBelow?: DataTableHideBelow;
  $minWidth?: string;
  $stickyLeft?: number;
}>`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  min-width: ${({ $minWidth }) => $minWidth ?? 'auto'};
  padding: ${s('xs')} ${s('sm')};
  text-align: ${({ $align }) => $align};

  /*
   * The pinned cell needs an opaque fill of its own: the row's hover colour is painted on the tr,
   * so a transparent pinned cell would let the scrolled cells slide visibly underneath it.
   */
  ${({ $stickyLeft }) => pinnedLeft($stickyLeft, c('white'))}
  ${({ $hideBelow }) => hiddenBelow($hideBelow)}

  /* An opaque pinned cell would otherwise be the one cell that ignores the row's hover. */
  ${({ $stickyLeft }) =>
    $stickyLeft !== undefined &&
    css`
      ${TableRow}:hover & {
        background-color: ${c('neutral50')};
      }
    `}
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

export const SelectionCheckbox = styled.input`
  accent-color: ${c('primary500')};
  cursor: pointer;
  height: ${s('sm')};
  width: ${s('sm')};
`;

export const RowActions = styled.div`
  display: inline-flex;
  gap: ${s('micro')};
  justify-content: flex-end;
`;
