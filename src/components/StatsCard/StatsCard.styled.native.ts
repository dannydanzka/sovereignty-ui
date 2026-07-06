/**
 * StatsCard Styled Components — React Native resolution
 *
 * Same variant mapping as StatsCard.styled.ts on Div/Span primitives.
 * The primary gradient becomes a solid accent color (no CSS gradients on RN);
 * icon sizing/color is up to the injected icon (no svg selectors, no currentColor).
 */

import styled from 'styled-components/native';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Span } from '../../primitives';
import type { StatsCardVariant, StyledStatsCardProps } from './StatsCard.interfaces';

const cardBackground = ($variant: StatsCardVariant) => {
  switch ($variant) {
    case 'primary':
      return c('accent500');
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

const iconBackground = ($variant: StatsCardVariant) => {
  if ($variant === 'primary') return 'rgba(255, 255, 255, 0.2)';
  if ($variant === 'default') return c('primary200');
  return 'rgba(255, 255, 255, 0.6)';
};

export const CardContainer = styled(Div)<StyledStatsCardProps>`
  background-color: ${({ $variant }) => cardBackground($variant)};
  border-radius: ${sh('lg')};
  box-shadow: ${el('sm')};
  gap: ${s('xs')};
  padding: ${s('md')};
`;

export const CardIcon = styled(Div)<StyledStatsCardProps>`
  align-items: center;
  background-color: ${({ $variant }) => iconBackground($variant)};
  border-radius: ${sh('full')};
  height: ${s('xl')};
  justify-content: center;
  width: ${s('xl')};
`;

export const CardValue = styled(Span)<StyledStatsCardProps>`
  color: ${({ $variant }) => ($variant === 'primary' ? c('white') : c('textPrimary'))};
  font-family: ${tf('display')};
  font-size: ${ts('3xl')};
  font-weight: ${tw('bold')};
`;

export const CardLabel = styled(Span)<StyledStatsCardProps>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.9)' : c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const CardSublabel = styled(Span)<StyledStatsCardProps>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.7)' : c('neutral400')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;
