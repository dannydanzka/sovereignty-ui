/**
 * Checkbox Styled Components
 */

import styled from 'styled-components';

import { color, layout, shape, spacing, typography } from '../../tokens';

const CHECKBOX_SIZE = layout.icon.md;
const CHECK_HEIGHT = `${spacing.xs}`;
const CHECK_WIDTH = `${spacing.micro}`;

export const CheckboxWrapper = styled.label<{ $disabled: boolean }>`
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  gap: ${spacing.xs};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const HiddenInput = styled.input`
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
`;

export const CheckboxBox = styled.div<{ $checked: boolean }>`
  align-items: center;
  background-color: ${({ $checked }) => ($checked ? color.primary500 : color.white)};
  border: 2px solid ${({ $checked }) => ($checked ? color.primary500 : color.neutral300)};
  border-radius: ${shape.sm};
  display: flex;
  flex-shrink: 0;
  height: ${CHECKBOX_SIZE};
  justify-content: center;
  transition: all 0.15s ease;
  width: ${CHECKBOX_SIZE};

  &::after {
    border: solid ${color.white};
    border-width: 0 2px 2px 0;
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    height: ${CHECK_HEIGHT};
    transform: rotate(45deg) translate(-1px, -1px);
    width: ${CHECK_WIDTH};
  }
`;

export const CheckboxLabel = styled.span`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
`;
