/**
 * Input Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledInputProps, StyledInputWrapperProps } from './Input.interfaces';

export const InputWrapper = styled.div<StyledInputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

export const InputLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input<StyledInputProps>`
  background-color: ${c('white')};
  border: 2px solid ${({ $hasError }) => ($hasError ? c('error') : c('neutral200'))};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  min-height: ${s('xl')};
  padding: ${s('sm')};
  padding-right: ${({ $hasToggle }) => ($hasToggle ? '48px' : s('sm'))};
  transition: all 0.2s ease-in-out;
  width: 100%;

  &::placeholder {
    color: ${c('textTertiary')};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? c('errorDark') : c('neutral300'))};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? c('error') : c('primary500'))};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? c('errorFocusShadow') : c('primaryFocusShadow'))};
    outline: none;
  }

  &:disabled {
    background-color: ${c('neutral50')};
    color: ${c('textDisabled')};
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: ${ts('lg')};
  height: 100%;
  justify-content: center;
  padding: 0 ${s('sm')};
  position: absolute;
  right: 0;
  top: 0;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${c('primary500')};
    outline-offset: -2px;
  }
`;

export const InputError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const InputRequired = styled.span`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;
