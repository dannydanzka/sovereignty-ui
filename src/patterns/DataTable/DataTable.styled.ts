/**
 * DataTable Styled Components
 */

import styled, { css, keyframes } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const DataTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
`;

export const DataTableToolbar = styled.div`
  display: flex;
  gap: ${spacing.sm};
  justify-content: flex-end;
`;

export const DataTableSearchInput = styled.input`
  border: 1px solid ${color.border};
  border-radius: ${shape.md};
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  max-width: 20rem;
  outline: none;
  padding: ${spacing.xs} ${spacing.sm};
  transition: border-color 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${color.textDisabled};
  }

  &:focus {
    border-color: ${color.primary500};
    box-shadow: 0 0 0 3px ${color.primaryFocusShadow};
  }
`;

export const DataTableContainer = styled.div`
  border: 1px solid ${color.border};
  border-radius: ${shape.lg};
  overflow-x: auto;
  width: 100%;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  min-width: 100%;
  width: 100%;
`;

export const TableHead = styled.thead`
  background-color: ${color.neutral50};
`;

export const TableHeadRow = styled.tr`
  border-bottom: 1px solid ${color.border};
`;

export const TableHeadCell = styled.th<{
  $align: 'center' | 'left' | 'right';
  $sortable: boolean;
  $width?: string;
}>`
  color: ${color.textSecondary};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
  font-weight: ${typography.weight.semibold};
  letter-spacing: ${typography.tracking.wide};
  padding: ${spacing.xs} ${spacing.sm};
  text-align: ${({ $align }) => $align};
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
  width: ${({ $width }) => $width ?? 'auto'};

  ${({ $sortable }) =>
    $sortable &&
    css`
      &:hover {
        color: ${color.textPrimary};
      }
    `}
`;

export const TableHeadCellContent = styled.span`
  align-items: center;
  display: inline-flex;
  gap: ${spacing.micro};
`;

export const SortIcon = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? color.primary500 : color.textDisabled)};
  display: inline-flex;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${color.borderLight};
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${color.neutral50};
  }
`;

export const TableCell = styled.td<{ $align: 'center' | 'left' | 'right' }>`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  padding: ${spacing.xs} ${spacing.sm};
  text-align: ${({ $align }) => $align};
`;

export const TableEmptyRow = styled.tr``;

export const TableEmptyCell = styled.td`
  color: ${color.textTertiary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  padding: ${spacing.xl} ${spacing.sm};
  text-align: center;
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const TableLoadingCell = styled.td`
  padding: ${spacing.xs} ${spacing.sm};
`;

export const TableLoadingBar = styled.div`
  animation: ${shimmer} 1.5s infinite;
  background: linear-gradient(
    90deg,
    ${color.neutral50} 25%,
    ${color.neutral100} 50%,
    ${color.neutral50} 75%
  );
  background-size: 200% 100%;
  border-radius: ${shape.sm};
  height: 1rem;
  width: 100%;
`;

export const DataTableFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${spacing.xs};
`;
