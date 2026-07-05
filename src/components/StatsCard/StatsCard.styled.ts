/**
 * StatsCard Styled Components
 *
 * Card for displaying stats: value, label, optional icon and sublabel.
 * Semantic variants (success/warning/danger/info) tint the background;
 * primary uses the brand gradient with inverse text.
 */

import styled from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StatsCardVariant, StyledStatsCardProps } from './StatsCard.interfaces';

const cardBackground = ($variant: StatsCardVariant) => {
  switch ($variant) {
    case 'primary':
      return `linear-gradient(135deg, ${c('accent500')}, ${c('tertiary300')})`;
    case 'success':
      return c('successLight');
    case 'warning':
      return c('warningLight');
    case 'danger':
      return c('errorLight');
    case 'info':
      return c('infoLight');
    case 'default':
      return c('white');
  }
};

const iconColor = ($variant: StatsCardVariant) => {
  switch ($variant) {
    case 'primary':
      return c('white');
    case 'success':
      return c('successDark');
    case 'warning':
      return c('warningDark');
    case 'danger':
      return c('errorDark');
    case 'info':
      return c('infoDark');
    case 'default':
      return c('accent500');
  }
};

export const CardContainer = styled.div<StyledStatsCardProps>`
  background: ${({ $variant }) => cardBackground($variant)};
  border-radius: ${sh('lg')};
  box-shadow: ${el('sm')};
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  padding: ${s('md')};
`;

const iconBackground = ($variant: StatsCardVariant) => {
  if ($variant === 'primary') return 'rgba(255, 255, 255, 0.2)';
  if ($variant === 'default') return c('primary200');
  return `rgb(${c('whiteRgb')} / 0.6)`;
};

export const CardIcon = styled.div<StyledStatsCardProps>`
  align-items: center;
  background: ${({ $variant }) => iconBackground($variant)};
  border-radius: ${sh('full')};
  color: ${({ $variant }) => iconColor($variant)};
  display: flex;
  height: ${s('xl')};
  justify-content: center;
  width: ${s('xl')};

  svg {
    height: ${s('sm')};
    width: ${s('sm')};
  }
`;

export const CardValue = styled.span<StyledStatsCardProps>`
  color: ${({ $variant }) => ($variant === 'primary' ? c('white') : c('textPrimary'))};
  font-family: ${tf('display')};
  font-size: ${ts('3xl')};
  font-weight: ${tw('bold')};
`;

export const CardLabel = styled.span<StyledStatsCardProps>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.9)' : c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const CardSublabel = styled.span<StyledStatsCardProps>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.7)' : c('neutral400')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;
