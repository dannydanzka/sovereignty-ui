/**
 * FileUploader Styled Components
 *
 * The drop zone itself is the `Dropzone` pattern — only the label and the file list live here.
 */

import styled from 'styled-components';

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
