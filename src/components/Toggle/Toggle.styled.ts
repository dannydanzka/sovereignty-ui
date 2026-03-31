/**
 * Toggle Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';
import { color } from '../../tokens';

const TRACK_SIZES = {
  md: { height: '24px', thumb: '20px', width: '44px' },
  sm: { height: '18px', thumb: '14px', width: '34px' },
} as const;

export const ToggleWrapper = styled.label<{ $disabled: boolean }>`
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

export const ToggleTrack = styled.div<{
  $checked: boolean;
  $size: 'sm' | 'md';
}>`
  background-color: ${({ $checked }) => ($checked ? c('success') : c('neutral300'))};
  border-radius: 9999px;
  height: ${({ $size }) => TRACK_SIZES[$size].height};
  position: relative;
  transition: background-color 0.2s ease;
  width: ${({ $size }) => TRACK_SIZES[$size].width};
`;

export const ToggleThumb = styled.div<{
  $checked: boolean;
  $size: 'sm' | 'md';
}>`
  background-color: ${c('white')};
  border-radius: 50%;
  box-shadow: 0 1px 3px rgb(${color.blackRgb} / 0.2);
  height: ${({ $size }) => TRACK_SIZES[$size].thumb};
  left: 2px;
  position: absolute;
  top: 2px;
  transform: translateX(
    ${({ $checked, $size }) =>
      $checked ? `calc(${TRACK_SIZES[$size].width} - ${TRACK_SIZES[$size].thumb} - 4px)` : '0'}
  );
  transition: transform 0.2s ease;
  width: ${({ $size }) => TRACK_SIZES[$size].thumb};
`;

export const ToggleLabel = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
