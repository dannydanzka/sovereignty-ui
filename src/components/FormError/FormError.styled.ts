/**
 * FormError Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';
import type { StyledFormErrorProps } from './FormError.interfaces';

export const StyledFormError = styled.span<StyledFormErrorProps>`
  color: ${c('errorDark')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${({ $variant }) => ($variant === 'field' ? ts('xs') : ts('sm'))};
  margin-top: ${({ $variant }) => ($variant === 'field' ? s('micro') : s('xs'))};
`;
