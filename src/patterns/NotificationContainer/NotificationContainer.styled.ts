/**
 * NotificationContainer Styled Components
 *
 * Fixed stack anchored to a screen corner, toast z-index layer.
 */

import styled, { css } from 'styled-components';

import { layout } from '../../tokens';
import type {
  NotificationPosition,
  StyledNotificationStackProps,
} from './NotificationContainer.interfaces';
import { s } from '../../tokens/css-variables';

const positionStyles = ($position: NotificationPosition) => {
  if ($position === 'top-left') {
    return css`
      left: ${s('md')};
      top: ${s('md')};
    `;
  }
  if ($position === 'bottom-left') {
    return css`
      bottom: ${s('md')};
      left: ${s('md')};
    `;
  }
  if ($position === 'bottom-right') {
    return css`
      bottom: ${s('md')};
      right: ${s('md')};
    `;
  }
  return css`
    right: ${s('md')};
    top: ${s('md')};
  `;
};

export const Container = styled.div<StyledNotificationStackProps>`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  max-width: 400px;
  position: fixed;
  width: calc(100vw - ${s('lg')});
  z-index: ${layout.zIndex.toast};
  ${({ $position }) => positionStyles($position)}
`;
