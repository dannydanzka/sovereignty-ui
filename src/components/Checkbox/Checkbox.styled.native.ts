/**
 * Checkbox Styled Components — React Native resolution
 *
 * No hidden input / CSS pseudo-element on native: the wrapper is a Pressable and
 * the checkmark is a rendered icon (see Checkbox.native.tsx). Colors live on each
 * element since native Text/View don't inherit them.
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

export const CheckboxWrapper = styled(Pressable)<{ $disabled: boolean }>`
  align-items: center;
  flex-direction: row;
  gap: ${s('xs')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const CheckboxBox = styled(Div)<{ $checked: boolean }>`
  align-items: center;
  background-color: ${({ $checked }) => ($checked ? c('primary500') : c('white'))};
  border-color: ${({ $checked }) => ($checked ? c('primary500') : c('neutral300'))};
  border-radius: ${sh('sm')};
  border-width: 2px;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

export const CheckboxLabel = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
