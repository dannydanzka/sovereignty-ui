/**
 * FileUploader Styled Components
 */

import styled, { css } from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

export const FileUploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  width: 100%;
`;

export const FileUploaderLabel = styled.label`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.medium};
`;

export const FileUploaderDropzone = styled.div<{
  $disabled: boolean;
  $hasError: boolean;
  $isDragOver: boolean;
}>`
  align-items: center;
  border: 2px dashed ${({ $hasError }) => ($hasError ? color.error : color.border)};
  border-radius: ${shape.lg};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  justify-content: center;
  min-height: 8rem;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  padding: ${spacing.lg};
  transition: all 0.2s ease;

  ${({ $hasError, $isDragOver }) =>
    $isDragOver &&
    css`
      background-color: ${$hasError ? color.errorBackground : color.primary50};
      border-color: ${$hasError ? color.error : color.primary500};
    `}

  &:hover {
    border-color: ${({ $disabled, $hasError }) =>
      $disabled ? undefined : $hasError ? color.error : color.primary500};
  }
`;

export const FileUploaderIcon = styled.div`
  color: ${color.textTertiary};
`;

export const FileUploaderText = styled.span`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  text-align: center;
`;

export const FileUploaderBrowse = styled.span`
  color: ${color.primary500};
  cursor: pointer;
  font-weight: ${typography.weight.medium};
  text-decoration: underline;
`;

export const FileUploaderDescription = styled.span`
  color: ${color.textTertiary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
  text-align: center;
`;

export const FileUploaderError = styled.span`
  color: ${color.error};
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const FileUploaderFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.micro};
`;

export const FileUploaderFileItem = styled.div`
  align-items: center;
  background-color: ${color.neutral50};
  border: 1px solid ${color.border};
  border-radius: ${shape.md};
  display: flex;
  gap: ${spacing.xs};
  justify-content: space-between;
  padding: ${spacing.xs} ${spacing.sm};
`;

export const FileUploaderFileName = styled.span`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileUploaderFileSize = styled.span`
  color: ${color.textTertiary};
  flex-shrink: 0;
  font-family: ${typography.family.body};
  font-size: ${typography.size.xs};
`;

export const FileUploaderRemoveButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${color.textTertiary};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  padding: ${spacing.micro};
  transition: color 0.2s ease;

  &:hover {
    color: ${color.error};
  }
`;

export const FileUploaderHiddenInput = styled.input`
  display: none;
`;
