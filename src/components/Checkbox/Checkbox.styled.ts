/**
 * Checkbox Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';
import { layout } from '../../tokens';

const CHECKBOX_SIZE = layout.icon.md;

export const CheckboxWrapper = styled.label<{ $disabled: boolean }>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${s('xs')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const HiddenInput = styled.input`
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`;

export const CheckboxBox = styled.div<{ $checked: boolean }>`
  align-items: center;
  background-color: ${({ $checked }) => ($checked ? c('primary500') : c('white'))};
  border: 2px solid ${({ $checked }) => ($checked ? c('primary500') : c('neutral300'))};
  border-radius: ${sh('sm')};
  display: flex;
  flex-shrink: 0;
  height: ${CHECKBOX_SIZE};
  justify-content: center;
  transition: all 0.15s ease;
  width: ${CHECKBOX_SIZE};

  &::after {
    border: solid ${c('white')};
    border-width: 0 2px 2px 0;
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    height: ${s('xs')};
    transform: rotate(45deg) translate(-1px, -1px);
    width: ${s('micro')};
  }
`;

export const CheckboxLabel = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
