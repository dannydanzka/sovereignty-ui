/**
 * Dropdown Styled Components
 */

import styled, { css } from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledDropdownItemProps, StyledDropdownMenuProps } from './Dropdown.interfaces';

export const Container = styled.div`
  display: inline-block;
  position: relative;
`;

export const Trigger = styled.button`
  align-items: center;
  background-color: ${c('white')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  cursor: pointer;
  display: flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  gap: ${s('xs')};
  justify-content: space-between;
  min-width: 160px;
  padding: ${s('xs')} ${s('sm')};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${c('primary400')};
  }

  &:focus {
    border-color: ${c('primary500')};
    box-shadow: 0 0 0 3px ${c('primary100')};
    outline: none;
  }

  &:disabled {
    background-color: ${c('neutral100')};
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &[data-open='true'] svg {
    transform: rotate(180deg);
  }
`;

export const Menu = styled.div<StyledDropdownMenuProps>`
  background: ${c('white')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  box-shadow: ${el('md')};
  left: 0;
  max-height: 240px;
  min-width: 100%;
  overflow-y: auto;
  position: absolute;
  z-index: 100;

  ${({ $position }) =>
    $position === 'top'
      ? css`
          bottom: calc(100% + ${s('micro')});
        `
      : css`
          top: calc(100% + ${s('micro')});
        `}
`;

export const Item = styled.button<StyledDropdownItemProps>`
  background: ${({ $selected }) => ($selected ? c('primary50') : 'transparent')};
  border: none;
  color: ${({ $disabled, $selected }) => {
    if ($disabled) return c('textTertiary');
    if ($selected) return c('primary700');
    return c('textPrimary');
  }};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${({ $selected }) => ($selected ? tw('medium') : tw('regular'))};
  padding: ${s('xs')} ${s('sm')};
  text-align: left;
  transition: background 0.15s ease;
  width: 100%;

  &:hover:not(:disabled) {
    background: ${({ $selected }) => ($selected ? c('primary100') : c('neutral50'))};
  }

  &:focus {
    background: ${c('primary50')};
    outline: none;
  }
`;

export const IconWrapper = styled.span`
  align-items: center;
  display: flex;
  height: ${s('sm')};
  justify-content: center;
  width: ${s('sm')};
`;
