/**
 * Input Styled Components — React Native resolution
 *
 * StyledInput builds on the TextField primitive (TextInput → maps onValueChange
 * to onChangeText and secureTextEntry/type to the right native props). The
 * password toggle is a Pressable. Native View/Text don't inherit color, so each
 * text piece sets its own; no hover/focus/transition/placeholder pseudos.
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span, TextField } from '../../primitives';
import type { StyledInputProps, StyledInputWrapperProps } from './Input.interfaces';

export const InputWrapper = styled(Div)<StyledInputWrapperProps>`
  gap: ${s('xs')};
  ${({ $fullWidth }) => ($fullWidth ? 'width: 100%;' : '')}
`;

export const InputLabel = styled(Span)<{ htmlFor?: string }>`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const InputContainer = styled(Div)`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled(TextField)<StyledInputProps>`
  background-color: ${c('white')};
  border-color: ${({ $hasError }) => ($hasError ? c('error') : c('neutral200'))};
  border-radius: ${sh('md')};
  border-width: 2px;
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  min-height: ${s('xl')};
  padding: ${s('sm')};
  padding-right: ${({ $hasToggle }) => ($hasToggle ? '48px' : s('sm'))};
  width: 100%;
`;

export const PasswordToggle = styled(Pressable)`
  align-items: center;
  bottom: 0;
  justify-content: center;
  padding-left: ${s('sm')};
  padding-right: ${s('sm')};
  position: absolute;
  right: 0;
  top: 0;
`;

export const InputError = styled(Span)`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const InputRequired = styled(Span)`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;
