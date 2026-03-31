/**
 * DetailLayout Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, tl, ts, tt, tw } from '../../tokens/css-variables';
import type { StyledDetailContentBoxProps, StyledDetailRowProps } from './DetailLayout.interfaces';

export const DetailSectionWrapper = styled.div`
  margin-bottom: ${s('md')};
`;

export const DetailLabelText = styled.span`
  color: ${c('textSecondary')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('medium')};
  letter-spacing: ${tt('wide')};
  margin-bottom: ${s('micro')};
  text-transform: uppercase;
`;

export const DetailValueText = styled.span`
  color: ${c('textPrimary')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
`;

export const DetailValueMonoText = styled(DetailValueText)`
  font-family: ${tf('mono')};
`;

export const DetailRowGrid = styled.div<StyledDetailRowProps>`
  display: grid;
  gap: ${s('sm')};
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  margin-bottom: ${s('sm')};

  @media (width <= 480px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailDividerLine = styled.hr`
  border: none;
  border-top: 1px solid ${c('border')};
  margin: ${s('md')} 0;
`;

export const DetailAmountText = styled.div`
  color: ${c('textPrimary')};
  font-family: ${tf('mono')};
  font-size: ${ts('base')};
  font-weight: ${tw('medium')};
`;

export const DetailAmountLargeText = styled(DetailAmountText)`
  font-size: ${ts('2xl')};
  font-weight: ${tw('bold')};
`;

export const DetailContentBoxWrapper = styled.div<StyledDetailContentBoxProps>`
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'info':
        return c('primary50');
      case 'warning':
        return c('warningBackground');
      case 'error':
        return c('errorBackground');
      case 'default':
      default:
        return c('neutral50');
    }
  }};
  border-left: 3px solid
    ${({ $variant }) => {
      switch ($variant) {
        case 'info':
          return c('primary500');
        case 'warning':
          return c('warning');
        case 'error':
          return c('error');
        case 'default':
        default:
          return c('neutral300');
      }
    }};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
  padding: ${s('sm')};
  white-space: pre-wrap;
`;

export const DetailInfoGridWrapper = styled.div`
  display: grid;
  gap: ${s('sm')};
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: ${s('md')};

  @media (width <= 480px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailMediaWrapper = styled.div`
  background: ${c('neutral100')};
  border-radius: ${sh('md')};
  max-height: 300px;
  overflow: hidden;
  width: 100%;

  img,
  video {
    height: auto;
    max-height: 300px;
    object-fit: contain;
    width: 100%;
  }
`;
