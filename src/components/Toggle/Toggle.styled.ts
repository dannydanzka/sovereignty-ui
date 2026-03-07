/**
 * Toggle Styled Components
 */

import styled from 'styled-components';

import { color, spacing, typography } from '../../tokens';

const TRACK_SIZES = {
  md: { height: '24px', thumb: '20px', width: '44px' },
  sm: { height: '18px', thumb: '14px', width: '34px' },
} as const;

export const ToggleWrapper = styled.label<{ $disabled: boolean }>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${spacing.xs};
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
  background-color: ${({ $checked }) => ($checked ? color.success : color.neutral300)};
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
  background-color: ${color.white};
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
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;
