/**
 * FormField Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';

export const FormFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const FormFieldLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const FormFieldRequired = styled.span`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;

export const FormFieldError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const FormFieldHelp = styled.span`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;
