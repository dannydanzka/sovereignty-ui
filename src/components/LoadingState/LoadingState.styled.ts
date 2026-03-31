/**
 * LoadingState Styled Components
 */

import styled, { keyframes } from 'styled-components';

import { c, s, tf, ts } from '../../tokens/css-variables';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  justify-content: center;
  padding: ${s('2xl')};
  text-align: center;
`;

export const SpinnerElement = styled.div`
  animation: ${spin} 1s linear infinite;
  border: 3px solid ${c('neutral200')};
  border-radius: 50%;
  border-top-color: ${c('primary500')};
  height: ${s('xl')};
  width: ${s('xl')};
`;

export const Text = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
`;
