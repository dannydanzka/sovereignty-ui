/**
 * ActionsCell
 *
 * The row-actions slot of a `DataTable`: icon-only `Button`s laid out in a right-aligned row with a
 * consistent gap. It exists so every table in every product spaces and aligns its row actions the
 * same way instead of each screen re-deriving a flex row.
 */

import type { ActionsCellProps } from './ActionsCell.interfaces';

import { ActionsCellWrapper } from './ActionsCell.styled';

export const ActionsCell = ({ children, className }: ActionsCellProps) => (
  <ActionsCellWrapper className={className}>{children}</ActionsCellWrapper>
);
