/**
 * EntityCell Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, ts, tw } from '../../tokens/css-variables';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  min-width: 0;
  width: 100%;
`;

export const Name = styled.span`
  color: ${c('textPrimary')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Id = styled.span`
  color: ${c('textTertiary')};
  display: block;
  font-family: ${tf('mono')};
  font-size: ${ts('xs')};
  margin-top: ${s('micro')};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Description = styled.span`
  color: ${c('textSecondary')};
  display: block;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
