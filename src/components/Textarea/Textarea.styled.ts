/**
 * Textarea Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, tl, ts } from '../../tokens/css-variables';

export const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const TextareaLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: var(--sui-font-weight-medium, 500);
`;

export const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  border: 1px solid ${({ $hasError }) => ($hasError ? c('error') : c('border'))};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
  outline: none;
  padding: ${s('xs')} ${s('sm')};
  resize: vertical;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${c('textDisabled')};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? c('error') : c('primary500'))};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? c('errorFocusShadow') : c('primaryFocusShadow'))};
  }

  &:disabled {
    background-color: ${c('backgroundDark')};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextareaFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TextareaError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const TextareaSpacer = styled.span``;

export const TextareaCount = styled.span<{ $isOver: boolean }>`
  color: ${({ $isOver }) => ($isOver ? c('error') : c('textTertiary'))};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin-left: auto;
`;
