/**
 * Pagination Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const PaginationWrapper = styled.nav`
  align-items: center;
  display: flex;
  gap: ${s('micro')};
  justify-content: center;
`;

const buttonBase = css`
  align-items: center;
  background: none;
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  color: ${c('textSecondary')};
  cursor: pointer;
  display: inline-flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
  justify-content: center;
  min-height: 2rem;
  min-width: 2rem;
  padding: ${s('micro')} ${s('xs')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${c('neutral50')};
    border-color: ${c('primary500')};
    color: ${c('primary500')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  ${buttonBase}

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${c('primary500')};
      border-color: ${c('primary500')};
      color: ${c('white')};

      &:hover:not(:disabled) {
        background-color: ${c('primary600')};
        border-color: ${c('primary600')};
        color: ${c('white')};
      }
    `}
`;

export const PaginationEllipsis = styled.span`
  align-items: center;
  color: ${c('textTertiary')};
  display: inline-flex;
  font-size: ${ts('sm')};
  justify-content: center;
  min-height: 2rem;
  min-width: 2rem;
`;
