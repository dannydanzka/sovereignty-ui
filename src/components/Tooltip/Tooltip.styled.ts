/**
 * Tooltip Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

const POSITION_STYLES = {
  bottom: css`
    left: 50%;
    top: calc(100% + ${s('xs')});
    transform: translateX(-50%);
  `,
  left: css`
    right: calc(100% + ${s('xs')});
    top: 50%;
    transform: translateY(-50%);
  `,
  right: css`
    left: calc(100% + ${s('xs')});
    top: 50%;
    transform: translateY(-50%);
  `,
  top: css`
    bottom: calc(100% + ${s('xs')});
    left: 50%;
    transform: translateX(-50%);
  `,
} as const;

export const TooltipContainer = styled.div`
  display: inline-block;
  position: relative;
`;

export const TooltipContent = styled.div<{ $position: 'top' | 'bottom' | 'left' | 'right' }>`
  background-color: ${c('dark300')};
  border-radius: ${sh('md')};
  color: ${c('white')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  font-weight: ${tw('medium')};
  max-width: 250px;
  opacity: 0;
  padding: ${s('micro')} ${s('xs')};
  pointer-events: none;
  position: absolute;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  z-index: 100;

  ${({ $position }) => POSITION_STYLES[$position]}

  ${TooltipContainer}:hover & {
    opacity: 1;
  }
`;
