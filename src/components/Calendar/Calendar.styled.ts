/**
 * Calendar Styled Components — web resolution.
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const CalendarWrapper = styled.div`
  background-color: ${c('surface')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('lg')};
  display: inline-flex;
  flex-direction: column;
  gap: ${s('sm')};
  padding: ${s('sm')};
  width: 20rem;
`;

export const CalendarHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const CalendarTitle = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  font-weight: ${tw('semibold')};
  text-transform: capitalize;
`;

export const NavButton = styled.button`
  align-items: center;
  background-color: ${c('transparent')};
  border: none;
  border-radius: ${sh('sm')};
  color: ${c('textSecondary')};
  cursor: pointer;
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 2rem;

  &:hover {
    background-color: ${c('neutral100')};
    color: ${c('textPrimary')};
  }
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const WeekdayCell = styled.span`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('medium')};
  padding: ${s('micro')} 0;
  text-align: center;
  text-transform: capitalize;
`;

export const DayGrid = styled.div`
  display: grid;
  gap: ${s('micro')};
  grid-template-columns: repeat(7, 1fr);
`;

export const DayCell = styled.button<{
  $selected: boolean;
  $inRange: boolean;
  $outside: boolean;
  $today: boolean;
}>`
  align-items: center;
  aspect-ratio: 1;
  background-color: ${({ $inRange, $selected }) =>
    $selected ? c('primary500') : $inRange ? c('primary50') : c('transparent')};
  border: 1px solid ${({ $today }) => ($today ? c('primary300') : c('transparent'))};
  border-radius: ${sh('sm')};
  color: ${({ $outside, $selected }) =>
    $selected ? c('white') : $outside ? c('textTertiary') : c('textPrimary')};
  cursor: pointer;
  display: flex;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ $selected }) => ($selected ? c('primary600') : c('neutral100'))};
  }

  &:disabled {
    background-color: ${c('transparent')};
    color: ${c('textDisabled')};
    cursor: not-allowed;
    text-decoration: line-through;
  }
`;
