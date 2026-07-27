/**
 * Avatar Styled Components
 */

import styled from 'styled-components';

import type { AvatarSize } from './Avatar.interfaces';
import { c, tf, ts, tw } from '../../tokens/css-variables';

const SIZE_MAP = {
  '2xl': '96px',
  lg: '48px',
  md: '40px',
  sm: '32px',
  xl: '64px',
  xs: '24px',
} as const;

const FONT_MAP = {
  '2xl': ts('3xl'),
  lg: ts('lg'),
  md: ts('base'),
  sm: ts('xs'),
  xl: ts('2xl'),
  xs: ts('xs'),
} as const;

/**
 * Colour goes through variables because an avatar carries the brand: a product wants its initials
 * chip in the brand colour, and without a seam that means a hand-rolled copy per placement (which is
 * exactly what a top bar and a profile header each ended up with).
 */
export const AvatarContainer = styled.div<{ $size: AvatarSize }>`
  align-items: center;
  background-color: var(--sui-avatar-bg, ${c('primary200')});
  border-radius: 50%;
  color: var(--sui-avatar-fg, ${c('textPrimary')});
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

export const AvatarInitials = styled.span<{ $size?: AvatarSize }>`
  font-size: inherit;
`;
