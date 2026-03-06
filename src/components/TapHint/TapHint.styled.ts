/**
 * TapHint Styled Components
 *
 * Pulsing overlay with fade-out animation.
 */

import styled, { css, keyframes } from 'styled-components';

import { color, shape, spacing } from '../../tokens';
import type { StyledTapHintProps, TapHintPosition } from './TapHint.interfaces';

const pulse = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; pointer-events: none; }
`;

const getPositionStyles = (position: TapHintPosition) => {
  switch (position) {
    case 'bottom-right':
      return css`
        bottom: ${spacing.sm};
        right: ${spacing.sm};
      `;
    case 'top-right':
      return css`
        right: ${spacing.sm};
        top: ${spacing.sm};
      `;
    case 'center':
      return css`
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
  }
};

const hiddenAnimation = css`
  animation:
    ${pulse} 2s ease-in-out infinite,
    ${fadeOut} 0.3s ease-out forwards;
`;

const visibleAnimation = css`
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const TapHintWrapper = styled.div<StyledTapHintProps & { $isHidden: boolean }>`
  align-items: center;
  ${({ $isHidden }) => ($isHidden ? hiddenAnimation : visibleAnimation)}
  background: ${color.black};
  border-radius: ${shape.full};
  color: ${color.white};
  display: flex;
  height: ${({ $size }) => `${$size}px`};
  justify-content: center;
  opacity: 0.7;
  pointer-events: none;
  position: absolute;
  width: ${({ $size }) => `${$size}px`};
  z-index: 5;

  ${({ $position }) => getPositionStyles($position)}
`;
