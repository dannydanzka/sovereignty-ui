/**
 * Select Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

const SIZE_STYLES = {
  lg: css`
    font-size: ${ts('base')};
    min-height: ${s('lg')};
    padding: ${s('xs')} ${s('md')};
  `,
  md: css`
    font-size: ${ts('sm')};
    min-height: ${s('md')};
    padding: ${s('xs')} ${s('sm')};
  `,
  sm: css`
    font-size: ${ts('xs')};
    min-height: ${s('sm')};
    padding: ${s('micro')} ${s('sm')};
  `,
} as const;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const SelectLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const StyledSelect = styled.select<{
  $hasError: boolean;
  $size: 'sm' | 'md' | 'lg';
}>`
  appearance: none;
  background-color: ${c('white')};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-position: right ${s('xs')} center;
  background-repeat: no-repeat;
  border: 1px solid ${({ $hasError }) => ($hasError ? c('error') : c('border'))};
  border-radius: ${sh('md')};
  color: ${c('textPrimary')};
  cursor: pointer;
  font-family: ${tf('body')};
  outline: none;
  padding-right: ${s('lg')};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  ${({ $size }) => SIZE_STYLES[$size]}

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? c('error') : c('primary500'))};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? c('errorFocusShadow') : c('primaryFocusShadow'))};
  }

  &:disabled {
    background-color: ${c('backgroundDark')};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SelectError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const SelectOption = styled.option``;
