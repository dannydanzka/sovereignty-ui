/**
 * PasswordInput Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input<{ $hasIcon?: boolean }>`
  background: ${c('white')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  padding: ${s('xs')};
  padding-right: ${({ $hasIcon }) => ($hasIcon ? '48px' : s('xs'))};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${c('textTertiary')};
  }

  &:hover:not(:disabled) {
    border-color: ${c('primary300')};
  }

  &:focus {
    border-color: ${c('primary500')};
    box-shadow: 0 0 0 3px ${c('primary100')};
    outline: none;
  }

  &:disabled {
    background: ${c('neutral100')};
    cursor: not-allowed;
  }
`;

export const ToggleButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${c('textTertiary')};
  cursor: pointer;
  display: flex;
  padding: ${s('xs')};
  position: absolute;
  right: ${s('micro')};
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${c('textPrimary')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
