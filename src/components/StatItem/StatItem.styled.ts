/**
 * StatItem Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import type { StyledStatItemProps, StyledStatsGridProps } from './StatItem.interfaces';

const getStatVariantStyles = (variant: StyledStatItemProps['$variant']) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${c('primary100')};
        color: ${c('primary700')};
      `;
    case 'success':
      return css`
        background: ${c('successBackground')};
        color: ${c('successDark')};
      `;
    case 'warning':
      return css`
        background: ${c('warningBackground')};
        color: ${c('warningDark')};
      `;
    case 'danger':
      return css`
        background: ${c('errorBackground')};
        color: ${c('errorDark')};
      `;
    case 'info':
      return css`
        background: ${c('secondary100')};
        color: ${c('secondary700')};
      `;
    case 'default':
    default:
      return css`
        background: ${c('neutral100')};
        color: ${c('neutral700')};
      `;
  }
};

export const StyledStatItem = styled.div<StyledStatItemProps>`
  align-items: center;
  border-radius: ${sh('md')};
  display: flex;
  gap: ${s('sm')};
  padding: ${s('sm')} ${s('md')};
  ${({ $variant }) => getStatVariantStyles($variant)}
`;

export const StatIconWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: ${s('md')};
  justify-content: center;
  width: ${s('md')};

  svg {
    height: 100%;
    width: 100%;
  }
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
`;

export const StatLabel = styled.span`
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  opacity: 0.8;
`;

export const StatValue = styled.span`
  font-family: ${tf('display')};
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
`;

export const StyledStatsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${s('md')};
  margin-bottom: ${s('md')};
`;

export const StyledStatsGrid = styled.div<StyledStatsGridProps>`
  display: grid;
  gap: ${s('md')};
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  margin-bottom: ${s('md')};

  @media (width <= 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width <= 640px) {
    grid-template-columns: 1fr;
  }
`;
