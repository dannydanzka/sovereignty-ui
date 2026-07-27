/**
 * Textarea Styled Components — React Native resolution
 *
 * StyledTextarea builds on the TextField primitive with `multiline` (the shared
 * Textarea.tsx passes it), which maps to TextInput's multiline. Text is
 * top-aligned; no resize/focus/placeholder pseudos on native.
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Span, TextField } from '../../primitives';

export const TextareaWrapper = styled(Div)`
  gap: ${s('micro')};
  width: 100%;
`;

export const TextareaLabel = styled(Span)<{ htmlFor?: string }>`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const StyledTextarea = styled(TextField)<{ $hasError: boolean }>`
  border-color: ${({ $hasError }) => ($hasError ? c('error') : c('border'))};
  border-radius: ${sh('md')};
  border-width: 1px;
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  min-height: 96px;
  padding: ${s('xs')} ${s('sm')};
  text-align-vertical: top;
  width: 100%;
`;

export const TextareaFooter = styled(Div)`
  flex-direction: row;
  justify-content: space-between;
`;

export const TextareaError = styled(Span)`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const TextareaSpacer = styled(Span)``;

export const TextareaCount = styled(Span)<{ $isOver: boolean }>`
  color: ${({ $isOver }) => ($isOver ? c('error') : c('textTertiary'))};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin-left: auto;
`;

/** See the web `TextareaRequired`. */
export const TextareaRequired = styled(Span)`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;
