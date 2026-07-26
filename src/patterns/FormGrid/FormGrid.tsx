/**
 * FormGrid
 *
 * Two-column form body that collapses to one on narrow viewports, plus `FormGrid.Full` for the field
 * that must span the whole row (a textarea, a notes box, a sub-table). Copied into every form as
 * `Grid` + `FieldFull`, which means each form is one edit away from a different breakpoint.
 */

import type { FormGridFullProps, FormGridProps } from './FormGrid.interfaces';

import { FullRow, GridWrapper } from './FormGrid.styled';

export const FormGridFull = ({ children, className }: FormGridFullProps) => (
  <FullRow className={className} data-testid='form-grid-full'>
    {children}
  </FullRow>
);

export const FormGrid = ({ children, className, columns = 2 }: FormGridProps) => (
  <GridWrapper $columns={columns} className={className} data-testid='form-grid'>
    {children}
  </GridWrapper>
);

FormGrid.Full = FormGridFull;
