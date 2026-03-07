/**
 * FormField Styled Components
 */

import styled from 'styled-components';

import { color, spacing, typography } from '../../tokens';

export const FormFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.micro};
  width: 100%;
`;

export const FormFieldLabel = styled.label`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
`;

export const FormFieldRequired = styled.span`
  color: ${color.error};
  margin-left: ${spacing.micro};
`;

export const FormFieldError = styled.span`
  color: ${color.error};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const FormFieldHelp = styled.span`
  color: ${color.textTertiary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;
