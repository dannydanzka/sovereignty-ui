/**
 * Input Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';
import { FORM_CONTROL_SIZES, formControlFrame } from '../../internal/form-control';
import type { StyledInputProps, StyledInputWrapperProps } from './Input.interfaces';
import { TextField } from '../../primitives';

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

export const StyledInput = styled(TextField)<StyledInputProps>`
  ${formControlFrame}
  ${({ $size = 'md' }) => FORM_CONTROL_SIZES[$size]}
  font-family: ${tf('body')};
  width: 100%;

  /* The toggle sits inside the frame, so the text must stop before it. */
  ${({ $hasToggle }) => $hasToggle && 'padding-right: 48px;'}
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

export const InputFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const InputSpacer = styled.span``;

export const InputCount = styled.span<{ $isOver: boolean }>`
  color: ${({ $isOver }) => ($isOver ? c('error') : c('textTertiary'))};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin-left: auto;
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
