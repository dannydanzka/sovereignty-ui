/**
 * FileUploader Styled Components
 */

import styled, { css } from 'styled-components';

import { c, s, sh, tf, ts, tw } from '../../tokens/css-variables';

export const FileUploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  width: 100%;
`;

export const FileUploaderLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('medium')};
`;

export const FileUploaderDropzone = styled.div<{
  $disabled: boolean;
  $hasError: boolean;
  $isDragOver: boolean;
}>`
  align-items: center;
  border: 2px dashed ${({ $hasError }) => ($hasError ? c('error') : c('border'))};
  border-radius: ${sh('lg')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-direction: column;
  gap: ${s('xs')};
  justify-content: center;
  min-height: 8rem;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  padding: ${s('lg')};
  transition: all 0.2s ease;

  ${({ $hasError, $isDragOver }) =>
    $isDragOver &&
    css`
      background-color: ${$hasError ? c('errorBackground') : c('primary50')};
      border-color: ${$hasError ? c('error') : c('primary500')};
    `}

  &:hover {
    border-color: ${({ $disabled, $hasError }) =>
      $disabled ? undefined : $hasError ? c('error') : c('primary500')};
  }
`;

export const FileUploaderIcon = styled.div`
  color: ${c('textTertiary')};
`;

export const FileUploaderText = styled.span`
  color: ${c('textSecondary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  text-align: center;
`;

export const FileUploaderBrowse = styled.span`
  color: ${c('primary500')};
  cursor: pointer;
  font-weight: ${tw('medium')};
  text-decoration: underline;
`;

export const FileUploaderDescription = styled.span`
  color: ${c('textTertiary')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  text-align: center;
`;

export const FileUploaderError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const FileUploaderFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
`;

export const FileUploaderFileItem = styled.div`
  align-items: center;
  background-color: ${c('neutral50')};
  border: 1px solid ${c('border')};
  border-radius: ${sh('md')};
  display: flex;
  gap: ${s('xs')};
  justify-content: space-between;
  padding: ${s('xs')} ${s('sm')};
`;

export const FileUploaderFileName = styled.span`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileUploaderFileSize = styled.span`
  color: ${c('textTertiary')};
  flex-shrink: 0;
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const FileUploaderRemoveButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${c('textTertiary')};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  padding: ${s('micro')};
  transition: color 0.2s ease;

  &:hover {
    color: ${c('error')};
  }
`;

export const FileUploaderHiddenInput = styled.input`
  display: none;
`;
