/**
 * Calendar Styled Components — React Native resolution.
 *
 * No CSS grid on native: the weekday row and day grid are flex-wrap rows of
 * 1/7-width cells. Pressable can't render raw text, so the day number is a
 * `DayCellLabel` Span whose color carries the selected/disabled state (native
 * Text does not inherit color from its Pressable parent). Same export names as
 * the web resolution, plus `DayCellLabel`.
 */

import styled from 'styled-components/native';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';
import { Div, Pressable, Span } from '../../primitives';

const CELL_WIDTH = '14.2857%';

export const CalendarWrapper = styled(Div)`
  background-color: ${c('surface')};
  border-color: ${c('border')};
  border-radius: ${sh('lg')};
  border-width: 1px;
  gap: ${s('sm')};
  padding: ${s('sm')};
  width: 320px;
`;

export const CalendarHeader = styled(Div)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const CalendarTitle = styled(Span)`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('base')};
  font-weight: ${tw('semibold')};
`;

export const NavButton = styled(Pressable)`
  align-items: center;
  border-radius: ${sh('sm')};
  height: 32px;
  justify-content: center;
  width: 32px;
`;

export const WeekdayRow = styled(Div)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const WeekdayCell = styled(Span)`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('medium')};
  padding-bottom: ${s('micro')};
  padding-top: ${s('micro')};
  text-align: center;
  width: ${CELL_WIDTH};
`;

export const DayGrid = styled(Div)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const DayCell = styled(Pressable)<{
  $selected: boolean;
  $inRange: boolean;
  $today: boolean;
}>`
  align-items: center;
  aspect-ratio: 1;
  background-color: ${({ $inRange, $selected }) =>
    $selected ? c('primary500') : $inRange ? c('primary50') : c('transparent')};
  border-color: ${({ $today }) => ($today ? c('primary300') : c('transparent'))};
  border-radius: ${sh('sm')};
  border-width: 1px;
  justify-content: center;
  width: ${CELL_WIDTH};
`;

export const DayCellLabel = styled(Span)<{
  $selected: boolean;
  $outside: boolean;
  $disabled: boolean;
}>`
  color: ${({ $disabled, $outside, $selected }) =>
    $selected
      ? c('white')
      : $disabled
        ? c('textDisabled')
        : $outside
          ? c('textTertiary')
          : c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  text-decoration-line: ${({ $disabled }) => ($disabled ? 'line-through' : 'none')};
`;
