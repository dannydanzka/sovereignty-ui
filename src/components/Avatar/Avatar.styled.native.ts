/**
 * Avatar Styled Components — React Native resolution
 *
 * Container is a Div (View); initials live in a Span (Text) because native
 * Text does not inherit font styles from the parent View. AvatarImage maps
 * the web props (src/alt) to native Image props via attrs so the shared
 * Avatar.tsx works unchanged.
 */

import { Image } from 'react-native';
import styled from 'styled-components/native';

import { c, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Span } from '../../primitives';

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

type AvatarSize = 'lg' | 'md' | 'sm' | 'xl';

export const AvatarContainer = styled(Div)<{ $size: AvatarSize }>`
  align-items: center;
  background-color: ${c('primary200')};
  border-radius: 9999px;
  flex-shrink: 0;
  height: ${({ $size }) => SIZE_MAP[$size]};
  justify-content: center;
  overflow: hidden;
  width: ${({ $size }) => SIZE_MAP[$size]};
`;

export const AvatarImage = styled(Image).attrs<{ alt?: string; src?: string }>((props) => ({
  accessibilityLabel: props.alt,
  source: { uri: props.src ?? '' },
}))<{ alt?: string; src?: string }>`
  height: 100%;
  width: 100%;
`;

export const AvatarInitials = styled(Span)<{ $size?: AvatarSize }>`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${({ $size }) => FONT_MAP[$size ?? 'md']};
  font-weight: ${tw('semibold')};
`;
