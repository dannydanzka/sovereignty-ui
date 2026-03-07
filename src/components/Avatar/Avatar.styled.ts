/**
 * Avatar Styled Components
 */

import styled from 'styled-components';

import { color, typography } from '../../tokens';

const SIZE_MAP = {
  lg: '48px',
  md: '40px',
  sm: '32px',
  xl: '64px',
} as const;

const FONT_MAP = {
  lg: typography.size.lg,
  md: typography.size.base,
  sm: typography.size.xs,
  xl: typography.size['2xl'],
} as const;

export const AvatarContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' | 'xl' }>`
  align-items: center;
  background-color: ${color.primary200};
  border-radius: 50%;
  color: ${color.textPrimary};
  display: inline-flex;
  flex-shrink: 0;
  font-family: ${typography.family.display};
  font-size: ${({ $size }) => FONT_MAP[$size]};
  font-weight: ${typography.weight.semibold};
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
