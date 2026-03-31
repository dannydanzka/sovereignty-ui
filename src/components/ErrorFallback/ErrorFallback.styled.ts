/**
 * ErrorFallback Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const ErrorContainer = styled.div`
  align-items: center;
  background-color: ${c('errorBackground')};
  border: 1px solid ${c('errorBorder')};
  border-radius: ${sh('lg')};
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  justify-content: center;
  min-height: 200px;
  padding: ${s('lg')};
`;

export const ErrorIconWrapper = styled.div`
  color: ${c('error')};
`;

export const ErrorTitle = styled.h3`
  color: ${c('textPrimary')};
  font-family: ${tf('display')};
  font-size: ${ts('xl')};
  font-weight: ${tw('semibold')};
  margin: 0;
  text-align: center;
`;

export const ErrorDescription = styled.p`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  margin: 0;
  max-width: 500px;
  text-align: center;
`;

export const ErrorActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${s('xs')};
  justify-content: center;
  margin-top: ${s('xs')};
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? c('primary500') : c('transparent')};
  border: 1px solid ${({ $variant }) => ($variant === 'primary' ? c('primary500') : c('border'))};
  border-radius: ${sh('md')};
  color: ${({ $variant }) => ($variant === 'primary' ? c('white') : c('textPrimary'))};
  cursor: pointer;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  padding: ${s('xs')} ${s('sm')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'primary' ? c('primary600') : c('backgroundDark')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
