/**
 * NotificationContainer Styled Components — React Native resolution
 *
 * Absolute-positioned corner stack (RN has no `position: fixed`; the consumer
 * mounts it inside a full-screen root). Column layout of toasts.
 */

import styled, { css } from 'styled-components/native';

import { Div } from '../../primitives';
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

export const Container = styled(Div)<StyledNotificationStackProps>`
  gap: ${s('xs')};
  max-width: 400px;
  position: absolute;
  z-index: ${layout.zIndex.toast};
  ${({ $position }) => positionStyles($position)}
`;
