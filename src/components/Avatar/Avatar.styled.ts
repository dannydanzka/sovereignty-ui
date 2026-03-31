/**
 * Avatar Styled Components
 */

import styled from 'styled-components';

import { c, tf, ts, tw } from '../../tokens/css-variables';

const SIZE_MAP = {
  lg: '48px',
  md: '40px',
  sm: '32px',
  xl: '64px',
} as const;

const FONT_MAP = {
  lg: ts('lg'),
  md: ts('base'),
  sm: ts('xs'),
  xl: ts('2xl'),
} as const;

export const AvatarContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' | 'xl' }>`
  align-items: center;
  background-color: ${c('primary200')};
  border-radius: 50%;
  color: ${c('textPrimary')};
  display: inline-flex;
  flex-shrink: 0;
  font-family: ${tf('display')};
  font-size: ${({ $size }) => FONT_MAP[$size]};
  font-weight: ${tw('semibold')};
  height: ${({ $size }) => SIZE_MAP[$size]};
  justify-content: center;
  overflow: hidden;
  width: ${({ $size }) => SIZE_MAP[$size]};
`;

export const AvatarImage = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;
