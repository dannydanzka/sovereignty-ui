/**
 * Chip Styled Components — React Native resolution
 *
 * Built on the Pressable primitive (TouchableOpacity → maps onClick to onPress). Native View/Text do
 * not cascade colour, so the pill carries background/border and `ChipLabel` carries the text colour.
 * No hover or focus-visible on native.
 */

import styled, { css } from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';
import type { StyledChipProps } from './Chip.interfaces';

const getSizeStyles = ($size: StyledChipProps['$size']) =>
  $size === 'sm'
    ? css`
        padding: ${s('micro')} ${s('sm')};
      `
    : css`
        padding: ${s('xs')} ${s('md')};
      `;

export const StyledChip = styled(Pressable)<StyledChipProps>`
  align-items: center;
  background-color: ${({ $selected }) => ($selected ? c('accent500') : c('white'))};
  border-color: ${({ $selected }) => ($selected ? c('accent500') : c('neutral200'))};
  border-radius: ${sh('full')};
  border-width: 1px;
  flex-direction: row;
  gap: ${s('micro')};
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ $size }) => getSizeStyles($size)}
`;

export const ChipLabel = styled(Span)<StyledChipProps>`
  color: ${({ $selected }) => ($selected ? c('onAccent') : c('textSecondary'))};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const ChipIcon = styled(Div)`
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
`;
