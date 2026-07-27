/**
 * Chip Styled Component
 *
 * The selected state uses `accent500`, which is the library's brand seam (`createBrandPalette`
 * maps the tenant's colour onto it), so a chip row adopts the tenant brand with no wrapper and
 * no extra variable.
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledChipProps } from './Chip.interfaces';

const getSizeStyles = ($size: StyledChipProps['$size']) =>
  $size === 'sm'
    ? css`
        padding: ${s('micro')} ${s('sm')};
      `
    : css`
        padding: ${s('xs')} ${s('md')};
      `;

export const StyledChip = styled.button<StyledChipProps>`
  align-items: center;
  background: ${({ $selected }) => ($selected ? c('accent500') : c('white'))};
  border: 1px solid ${({ $selected }) => ($selected ? c('accent500') : c('neutral200'))};
  border-radius: ${sh('full')};
  color: ${({ $selected }) => ($selected ? c('onAccent') : c('textSecondary'))};
  cursor: pointer;
  display: inline-flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  gap: ${s('micro')};
  transition: all 150ms ease;
  white-space: nowrap;

  ${({ $size }) => getSizeStyles($size)}

  &:hover:not(:disabled) {
    background: ${({ $selected }) => ($selected ? c('accent600') : c('neutral100'))};
    border-color: ${c('accent500')};
    color: ${({ $selected }) => ($selected ? c('onAccent') : c('accent500'))};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${c('accent200')};
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    height: ${s('sm')};
    width: ${s('sm')};
  }
`;

/**
 * The label is its own element only because native does not cascade colour, so the RN resolution has
 * to carry the text colour on the label. On web it inherits, and it takes the same props purely so
 * one `Chip.tsx` can serve both resolutions — same arrangement as `ButtonLabel`.
 */
export const ChipLabel = styled.span<StyledChipProps>`
  line-height: 1;
`;

export const ChipIcon = styled.span`
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
`;
