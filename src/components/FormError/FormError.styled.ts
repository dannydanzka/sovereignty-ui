/**
 * FormError Styled Components
 */

import styled from 'styled-components';

import { color, spacing, typography } from '../../tokens';
import type { StyledFormErrorProps } from './FormError.interfaces';

export const StyledFormError = styled.span<StyledFormErrorProps>`
  color: ${color.errorDark};
  display: block;
  font-family: ${typography.family.body};
  font-size: ${({ $variant }) => ($variant === 'field' ? typography.size.xs : typography.size.sm)};
  margin-top: ${({ $variant }) => ($variant === 'field' ? spacing.micro : spacing.xs)};
`;
