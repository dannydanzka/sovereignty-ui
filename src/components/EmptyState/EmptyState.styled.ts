/**
 * EmptyState Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, tl, ts, tw } from '../../tokens/css-variables';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  justify-content: center;
  padding: ${s('2xl')};
  text-align: center;
`;

export const IconWrapper = styled.div`
  align-items: center;
  background: ${c('neutral100')};
  border-radius: 50%;
  color: ${c('textTertiary')};
  display: flex;
  height: ${s('4xl')};
  justify-content: center;
  width: ${s('4xl')};

  svg {
    height: ${s('lg')};
    width: ${s('lg')};
  }
`;

export const Title = styled.h3`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('lg')};
  font-weight: ${tw('semibold')};
  margin: 0;
`;

export const Message = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  line-height: ${tl('relaxed')};
  margin: 0;
  max-width: 400px;
`;

export const Action = styled.div`
  margin-top: ${s('xs')};
`;
