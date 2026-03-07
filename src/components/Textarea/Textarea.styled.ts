/**
 * Textarea Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.micro};
  width: 100%;
`;

export const TextareaLabel = styled.label`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
`;

export const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  border: 1px solid ${({ $hasError }) => ($hasError ? color.error : color.border)};
  border-radius: ${shape.md};
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: ${typography.leading.relaxed};
  outline: none;
  padding: ${spacing.xs} ${spacing.sm};
  resize: vertical;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  &::placeholder {
    color: ${color.textDisabled};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? color.error : color.primary500)};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? color.errorFocusShadow : color.primaryFocusShadow)};
  }

  &:disabled {
    background-color: ${color.backgroundDark};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextareaFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TextareaError = styled.span`
  color: ${color.error};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const TextareaSpacer = styled.span``;

export const TextareaCount = styled.span<{ $isOver: boolean }>`
  color: ${({ $isOver }) => ($isOver ? color.error : color.textTertiary)};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
  margin-left: auto;
`;
