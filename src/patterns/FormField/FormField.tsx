/**
 * FormField
 *
 * Wrapper for form inputs providing label, error message, and help text.
 * Accepts any form control (Input, Select, Textarea, Checkbox) as children.
 */

import type { FormFieldProps } from './FormField.interfaces';

import {
  FormFieldError,
  FormFieldHelp,
  FormFieldLabel,
  FormFieldRequired,
  FormFieldWrapper,
} from './FormField.styled';

export const FormField = ({
  children,
  className,
  error,
  helpText,
  htmlFor,
  label,
  required = false,
}: FormFieldProps) => (
  <FormFieldWrapper className={className}>
    {label && (
      <FormFieldLabel htmlFor={htmlFor}>
        {label}
        {required && <FormFieldRequired>*</FormFieldRequired>}
      </FormFieldLabel>
    )}
    {children}
    {error && <FormFieldError>{error}</FormFieldError>}
    {!error && helpText && <FormFieldHelp>{helpText}</FormFieldHelp>}
  </FormFieldWrapper>
);
