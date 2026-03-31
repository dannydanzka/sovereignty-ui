/**
 * StatsCard Styled Components
 *
 * Card for displaying stats: value, label, optional icon and sublabel.
 */

import styled from 'styled-components';

import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const CardContainer = styled.div<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `linear-gradient(135deg, ${c('accent500')}, ${c('tertiary300')})`;
      case 'success':
        return c('successLight');
      case 'warning':
        return c('warningLight');
      case 'default':
        return c('white');
    }
  }};
  border-radius: ${sh('lg')};
  box-shadow: ${el('sm')};
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  padding: ${s('md')};
`;

export const CardIcon = styled.div<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  align-items: center;
  background: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : c('primary200')};
  border-radius: ${sh('full')};
  color: ${({ $variant }) => ($variant === 'primary' ? c('white') : c('accent500'))};
  display: flex;
  height: ${s('xl')};
  justify-content: center;
  width: ${s('xl')};

  svg {
    height: ${s('sm')};
    width: ${s('sm')};
  }
`;

export const CardValue = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) => ($variant === 'primary' ? c('white') : c('textPrimary'))};
  font-family: ${tf('display')};
  font-size: ${ts('3xl')};
  font-weight: ${tw('bold')};
`;

export const CardLabel = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.9)' : c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;

export const CardSublabel = styled.span<{
  $variant: 'default' | 'primary' | 'success' | 'warning';
}>`
  color: ${({ $variant }) =>
    $variant === 'primary' ? 'rgba(255, 255, 255, 0.7)' : c('neutral400')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;
