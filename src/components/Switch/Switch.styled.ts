/**
 * Switch Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';
import type { StyledSwitchTrackProps, StyledSwitchWrapperProps } from './Switch.interfaces';

export const Wrapper = styled.label<StyledSwitchWrapperProps>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${s('xs')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

export const HiddenInput = styled.input`
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`;

export const Track = styled.span<StyledSwitchTrackProps>`
  background-color: ${({ $checked }) => ($checked ? c('primary500') : c('neutral300'))};
  border-radius: ${sh('full')};
  display: inline-block;
  height: ${s('md')};
  position: relative;
  transition: background-color 0.2s ease;
  width: ${s('xl')};

  &::after {
    background-color: ${c('white')};
    border-radius: ${sh('full')};
    content: '';
    height: ${s('sm')};
    left: ${({ $checked }) => ($checked ? '22px' : '2px')};
    position: absolute;
    top: 2px;
    transition: left 0.2s ease;
    width: ${s('sm')};
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    background-color: ${c('neutral200')};
  `}
`;

export const Label = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
