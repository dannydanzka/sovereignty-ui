/**
 * ImageUploader Styled Components
 *
 * Dashed drop-look area with image preview, hover camera overlay, and
 * loading overlay.
 */

import styled, { keyframes } from 'styled-components';

import { c, mo, s, sh, ts, tw } from '../../tokens/css-variables';
import type { StyledUploadAreaProps } from './ImageUploader.interfaces';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  width: 100%;
`;

export const Label = styled.label`
  color: ${c('textSecondary')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const UploadArea = styled.div<StyledUploadAreaProps>`
  align-items: center;
  background-color: ${c('backgroundAlt')};
  border: 2px dashed ${c('border')};
  border-radius: ${sh('lg')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  height: ${({ $height }) => $height};
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  overflow: hidden;
  position: relative;
  transition: ${mo('normal')};
  width: 100%;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? c('border') : c('primary400'))};
  }
`;

export const PreviewImage = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;

export const Placeholder = styled.div`
  align-items: center;
  color: ${c('textTertiary')};
  display: flex;
  flex-direction: column;
  font-size: ${ts('sm')};
  gap: ${s('xs')};
`;

export const PlaceholderText = styled.span`
  color: inherit;
`;

export const Overlay = styled.div`
  align-items: center;
  background-color: rgb(${c('blackRgb')} / 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: 0;
  position: absolute;
  transition: ${mo('normal')};

  &:hover {
    opacity: 1;
  }

  svg {
    color: ${c('white')};
    height: ${s('lg')};
    width: ${s('lg')};
  }
`;

export const LoadingOverlay = styled.div`
  align-items: center;
  background-color: rgb(${c('blackRgb')} / 0.7);
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;

  svg {
    animation: ${spin} 1s linear infinite;
    color: ${c('white')};
    height: ${s('lg')};
    width: ${s('lg')};
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;
