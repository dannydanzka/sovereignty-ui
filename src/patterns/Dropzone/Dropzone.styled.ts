/**
 * Dropzone Styled Components
 */

import styled from 'styled-components';

import { c, s, sh, tf, ts } from '../../tokens/css-variables';

/**
 * The zone IS the button: making it a real button gives keyboard activation and a focus ring for
 * free, which a `div` with an `onClick` never has.
 */
export const DropzoneZone = styled.button<{ $active: boolean }>`
  align-items: center;
  background: ${({ $active }) => ($active ? c('primary50') : c('surface'))};
  border: 2px dashed ${({ $active }) => ($active ? c('primary500') : c('border'))};
  border-radius: ${sh('md')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  padding: ${s('lg')};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: ${c('primary500')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    color: ${c('textTertiary')};
  }
`;

export const DropzoneInvitation = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  text-align: center;
`;

export const DropzoneHint = styled.span`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  text-align: center;
`;

export const DropzoneRejection = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin-top: ${s('xs')};
`;

/** Off-screen rather than `display: none`: a hidden input is still the accessible name of the control. */
export const DropzoneHiddenInput = styled.input`
  height: 1px;
  opacity: 0;
  position: absolute;
  width: 1px;
`;

export const DropzoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
