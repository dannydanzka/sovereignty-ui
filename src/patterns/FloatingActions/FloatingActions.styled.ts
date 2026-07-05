/**
 * FloatingActions Styled Components
 *
 * Vertically centered floating circular buttons pinned to a screen side,
 * with staggered fade-in and a subtle breathing glow (optional).
 */

import styled, { css, keyframes } from 'styled-components';

import { c, mo, s } from '../../tokens/css-variables';
import { layout } from '../../tokens';
import type {
  StyledFloatingButtonProps,
  StyledFloatingContainerProps,
} from './FloatingActions.interfaces';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const breath = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const Container = styled.div<StyledFloatingContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: ${layout.zIndex.fixed};
  ${({ $side }) =>
    $side === 'left'
      ? css`
          left: ${s('md')};
        `
      : css`
          right: ${s('md')};
        `}

  @media (max-width: ${layout.breakpoint.md}) {
    gap: ${s('xs')};
    ${({ $side }) =>
      $side === 'left'
        ? css`
            left: ${s('sm')};
          `
        : css`
            right: ${s('sm')};
          `}
  }
`;

const buttonBase = css`
  align-items: center;
  backdrop-filter: blur(10px);
  background: rgb(${c('tealRgb')} / 0.1);
  border: 1px solid rgb(${c('tealRgb')} / 0.2);
  border-radius: 50%;
  color: ${c('primary500')};
  cursor: pointer;
  display: flex;
  height: ${s('2xl')};
  justify-content: center;
  text-decoration: none;
  transition: all ${mo('fast')};
  width: ${s('2xl')};

  &:hover {
    background: rgb(${c('tealRgb')} / 0.2);
    transform: translateY(-3px) scale(1.1);
  }

  svg {
    height: ${s('sm')};
    width: ${s('sm')};
  }
`;

const animation = ({ $animated, $delay }: StyledFloatingButtonProps) =>
  $animated
    ? css`
        animation:
          ${fadeInUp} 1s ease-out ${$delay}s both,
          ${breath} 6s ease-in-out infinite ${$delay * 0.3}s;
      `
    : css``;

export const ActionLink = styled.a<StyledFloatingButtonProps>`
  ${buttonBase}
  ${animation}
`;

export const ActionTrigger = styled.button<StyledFloatingButtonProps>`
  ${buttonBase}
  ${animation}
  padding: 0;
`;
