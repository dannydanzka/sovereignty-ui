/**
 * FormActions
 */

import type { FormActionsProps } from './FormActions.interfaces';

import { StyledFormActions } from './FormActions.styled';

export const FormActions = ({ align = 'right', children, className }: FormActionsProps) => (
  <StyledFormActions $align={align} className={className}>
    {children}
  </StyledFormActions>
);
