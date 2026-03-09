/**
 * FormGroup
 */

import type { FormGroupProps } from './FormGroup.interfaces';

import { StyledFormGroup } from './FormGroup.styled';

export const FormGroup = ({ children, className }: FormGroupProps) => (
  <StyledFormGroup className={className}>{children}</StyledFormGroup>
);
