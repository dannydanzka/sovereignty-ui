/**
 * Switch Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';
import type { StyledSwitchTrackProps, StyledSwitchWrapperProps } from './Switch.interfaces';

export const Wrapper = styled.label<StyledSwitchWrapperProps>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${spacing.xs};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

export const HiddenInput = styled.input`
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`;

export const Track = styled.span<StyledSwitchTrackProps>`
  background-color: ${({ $checked }) => ($checked ? color.primary500 : color.neutral300)};
  border-radius: ${shape.full};
  display: inline-block;
  height: ${spacing.md};
  position: relative;
  transition: background-color 0.2s ease;
  width: ${spacing.xl};

  &::after {
    background-color: ${color.white};
    border-radius: ${shape.full};
    content: '';
    height: ${spacing.sm};
    left: ${({ $checked }) => ($checked ? '22px' : '2px')};
    position: absolute;
    top: 2px;
    transition: left 0.2s ease;
    width: ${spacing.sm};
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    background-color: ${color.neutral200};
  `}
`;

export const Label = styled.span`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;
