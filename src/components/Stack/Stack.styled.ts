/**
 * Stack Styled Components
 */

import styled from 'styled-components';

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

export const StyledStack = styled.div<StyledStackProps>`
  align-items: ${({ $align }) => ($align ? ALIGN[$align] : 'stretch')};
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${({ $gap }) => s($gap)};
  justify-content: ${({ $justify }) => ($justify ? JUSTIFY[$justify] : 'flex-start')};
  ${({ $direction, $wrap }) => ($wrap && $direction === 'row' ? 'flex-wrap: wrap;' : '')}
`;
