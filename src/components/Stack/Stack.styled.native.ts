/**
 * Stack Styled Components — React Native resolution
 *
 * Same API as Stack.styled.ts on the Div primitive (View). RN's flexbox defaults differ from the
 * web's — `flexDirection` is `column` and `alignItems` is `stretch` — so both are always written
 * explicitly here to keep one Stack behaving identically on both platforms.
 */

import styled from 'styled-components/native';

import { Div } from '../../primitives';
import { s } from '../../tokens/css-variables';
import type { StackAlign, StackJustify, StyledStackProps } from './Stack.interfaces';

const ALIGN: Record<StackAlign, string> = {
  baseline: 'baseline',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const JUSTIFY: Record<StackJustify, string> = {
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};

export const StyledStack = styled(Div)<StyledStackProps>`
  align-items: ${({ $align }) => ($align ? ALIGN[$align] : 'stretch')};
  flex-direction: ${({ $direction }) => $direction};
  gap: ${({ $gap }) => s($gap)};
  justify-content: ${({ $justify }) => ($justify ? JUSTIFY[$justify] : 'flex-start')};
  ${({ $direction, $wrap }) => ($wrap && $direction === 'row' ? 'flex-wrap: wrap;' : '')}
`;
