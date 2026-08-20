/**
 * FileUploader
 *
 * A managed file list on top of `Dropzone`: the zone validates (type, size and count — on drop as
 * well as on pick) and this pattern accumulates accepted files into `value`, with per-file remove.
 * UI-only — actual upload logic is handled via onChange callback.
 *
 * Copy flows through the `texts` prop (`DropzoneTexts`). The defaults are neutral English and every
 * string is overridable — pass your product's copy.
 */

import { useCallback } from 'react';
import { X } from 'lucide-react';

import { Dropzone } from '../Dropzone';
import { FILE_UPLOADER_DEFAULT_TEXTS } from './FileUploader.constants';
import type { FileUploaderFile, FileUploaderProps } from './FileUploader.interfaces';

import {
  FileUploaderFileItem,
  FileUploaderFileList,
  FileUploaderFileName,
  FileUploaderFileSize,
  FileUploaderLabel,
  FileUploaderRemoveButton,
  FileUploaderWrapper,
} from './FileUploader.styled';

let fileIdCounter = 0;

const generateFileId = (): string => {
  fileIdCounter += 1;
  return `file-${Date.now()}-${fileIdCounter}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileUploader = ({
  accept,
  className,
  description,
  disabled = false,
  error,
  label,
  maxFiles = 10,
  maxSizeMB = 10,
  multiple = false,
  onChange,
  texts = FILE_UPLOADER_DEFAULT_TEXTS,
  value = [],
}: FileUploaderProps) => {
  const remaining = Math.max(maxFiles - value.length, 0);

  const handleFiles = useCallback(
    (files: File[]) => {
      const newFiles: FileUploaderFile[] = files.map((file) => ({
        file,
        id: generateFileId(),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      onChange([...value, ...newFiles]);
    },
    [onChange, value]
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const { fileId } = e.currentTarget.dataset;
      if (!fileId) return;
      const fileToRemove = value.find((f) => f.id === fileId);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      onChange(value.filter((f) => f.id !== fileId));
    },
    [onChange, value]
  );

  return (
    <FileUploaderWrapper className={className}>
      {label && <FileUploaderLabel>{label}</FileUploaderLabel>}

      <Dropzone
        accept={accept}
        disabled={disabled || remaining === 0}
        error={error}
        hint={description}
        maxFiles={multiple ? remaining : 1}
        maxSizeMB={maxSizeMB}
        texts={texts}
        onFiles={handleFiles}
      />

      {value.length > 0 && (
        <FileUploaderFileList>
          {value.map((uploaderFile) => (
            <FileUploaderFileItem key={uploaderFile.id}>
              <FileUploaderFileName>{uploaderFile.file.name}</FileUploaderFileName>
              <FileUploaderFileSize>{formatFileSize(uploaderFile.file.size)}</FileUploaderFileSize>
              <FileUploaderRemoveButton
                aria-label={texts.removeFile(uploaderFile.file.name)}
                data-file-id={uploaderFile.id}
                type='button'
                onClick={handleRemoveClick}
              >
                <X size={16} />
              </FileUploaderRemoveButton>
            </FileUploaderFileItem>
          ))}
        </FileUploaderFileList>
      )}
    </FileUploaderWrapper>
  );
};
