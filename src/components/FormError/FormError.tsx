/**
 * FormError
 */

import type { FormErrorProps } from './FormError.interfaces';

import { StyledFormError } from './FormError.styled';

export const FormError = ({ children, className, variant = 'form' }: FormErrorProps) => (
  <StyledFormError $variant={variant} className={className}>
    {children}
  </StyledFormError>
);
