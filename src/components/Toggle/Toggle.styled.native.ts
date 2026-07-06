/**
 * Toggle Styled Components — React Native resolution
 *
 * Pressable wrapper (no hidden input); the thumb is positioned with `left`
 * instead of a CSS transform/transition. Colors live on each element.
 */

import styled from 'styled-components/native';

import { c, s, tf, ts } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

const TRACK_SIZES = {
  md: { height: '24px', thumb: '20px', width: '44px' },
  sm: { height: '18px', thumb: '14px', width: '34px' },
} as const;

const thumbLeft = ($checked: boolean, $size: 'md' | 'sm') => {
  if (!$checked) return '2px';
  const { thumb, width } = TRACK_SIZES[$size];
  return `${parseInt(width, 10) - parseInt(thumb, 10) - 2}px`;
};

export const ToggleWrapper = styled(Pressable)<{ $disabled: boolean }>`
  align-items: center;
  flex-direction: row;
  gap: ${s('xs')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const ToggleTrack = styled(Div)<{ $checked: boolean; $size: 'md' | 'sm' }>`
  background-color: ${({ $checked }) => ($checked ? c('success') : c('neutral300'))};
  border-radius: 9999px;
  height: ${({ $size }) => TRACK_SIZES[$size].height};
  position: relative;
  width: ${({ $size }) => TRACK_SIZES[$size].width};
`;

export const ToggleThumb = styled(Div)<{ $checked: boolean; $size: 'md' | 'sm' }>`
  background-color: ${c('white')};
  border-radius: 9999px;
  height: ${({ $size }) => TRACK_SIZES[$size].thumb};
  left: ${({ $checked, $size }) => thumbLeft($checked, $size)};
  position: absolute;
  top: 2px;
  width: ${({ $size }) => TRACK_SIZES[$size].thumb};
`;

export const ToggleLabel = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
