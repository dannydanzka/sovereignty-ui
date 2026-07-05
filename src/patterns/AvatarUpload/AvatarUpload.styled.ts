/**
 * AvatarUpload Styled Components
 *
 * Circular avatar with hover camera overlay and spinning loading overlay.
 */

import styled, { css, keyframes } from 'styled-components';

import type {
  AvatarUploadSize,
  StyledAvatarProps,
  StyledAvatarWrapperProps,
} from './AvatarUpload.interfaces';
import { c, el, s, sh, tf, ts, tw } from '../../tokens/css-variables';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const sizeStyles = ($size: AvatarUploadSize) => {
  if ($size === 'large') {
    return css`
      font-size: ${ts('4xl')};
      height: 120px;
      width: 120px;
    `;
  }
  if ($size === 'small') {
    return css`
      font-size: ${ts('base')};
      height: ${s('2xl')};
      width: ${s('2xl')};
    `;
  }
  return css`
    font-size: ${ts('2xl')};
    height: ${s('6xl')};
    width: ${s('6xl')};
  `;
};

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
`;

export const AvatarWrapper = styled.div<StyledAvatarWrapperProps>`
  border-radius: ${sh('full')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  ${({ $size }) => sizeStyles($size)}

  &:hover > div:last-child {
    opacity: ${({ $disabled }) => ($disabled ? 0 : 1)};
  }
`;

export const Avatar = styled.div<StyledAvatarProps>`
  align-items: center;
  background: ${({ $hasPhoto }) => ($hasPhoto ? 'transparent' : c('secondary700'))};
  border: 4px solid ${c('white')};
  border-radius: ${sh('full')};
  box-shadow: ${el('lg')};
  color: ${c('white')};
  display: flex;
  font-family: ${tf('display')};
  font-weight: ${tw('bold')};
  justify-content: center;
  overflow: hidden;
  text-transform: uppercase;
  ${({ $size }) => sizeStyles($size)}
`;

export const AvatarImage = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;

export const Overlay = styled.div`
  align-items: center;
  background: rgb(${c('blackRgb')} / 0.5);
  border-radius: ${sh('full')};
  color: ${c('white')};
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: 0;
  position: absolute;
  transition: opacity 0.2s ease-in-out;

  svg {
    height: ${s('md')};
    width: ${s('md')};
  }
`;

export const LoadingOverlay = styled.div`
  align-items: center;
  background: rgb(${c('blackRgb')} / 0.6);
  border-radius: ${sh('full')};
  color: ${c('white')};
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;

  svg {
    animation: ${spin} 1s linear infinite;
    height: ${s('md')};
    width: ${s('md')};
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Name = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  text-align: center;
`;
