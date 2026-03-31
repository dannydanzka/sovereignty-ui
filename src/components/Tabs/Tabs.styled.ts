/**
 * Tabs Styled Components
 *
 * Tab navigation with active indicator and badge support.
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { layout } from '../../tokens';

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabList = styled.div`
  border-bottom: 2px solid ${c('neutral200')};
  display: flex;
  gap: ${s('micro')};
  overflow-x: auto;
  scrollbar-width: none;

  @media (min-width: ${layout.breakpoint.md}) {
    gap: ${s('xs')};
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button<{ $isActive: boolean; $isDisabled: boolean }>`
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${({ $isActive }) => ($isActive ? c('accent500') : 'transparent')};
  color: ${({ $isActive, $isDisabled }) => {
    if ($isDisabled) return c('neutral400');
    return $isActive ? c('accent500') : c('textSecondary');
  }};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-shrink: 0;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${({ $isActive }) => ($isActive ? tw('semibold') : tw('medium'))};
  gap: ${s('xs')};
  margin-bottom: -2px;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  padding: ${s('sm')} ${s('sm')};
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  @media (min-width: ${layout.breakpoint.md}) {
    font-size: ${ts('base')};
    padding: ${s('sm')} ${s('md')};
  }

  &:hover:not(:disabled) {
    background: ${c('neutral50')};
    color: ${({ $isActive }) => ($isActive ? c('accent500') : c('textPrimary'))};
  }

  svg {
    height: ${s('sm')};
    width: ${s('sm')};
  }
`;

export const TabBadge = styled.span`
  background: ${c('accent500')};
  border-radius: ${sh('full')};
  color: ${c('white')};
  font-size: ${ts('xs')};
  font-weight: ${tw('semibold')};
  min-width: ${s('sm')};
  padding: ${s('micro')} ${s('xs')};
  text-align: center;
`;

export const TabContent = styled.div`
  padding: ${s('md')} 0;
`;
