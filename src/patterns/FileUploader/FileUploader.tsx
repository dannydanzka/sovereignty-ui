/**
 * FileUploader
 *
 * Drag-and-drop file upload zone with file list preview.
 * UI-only — actual upload logic is handled via onChange callback.
 */

import type { DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { FileUploaderFile, FileUploaderProps } from './FileUploader.interfaces';

import {
  FileUploaderBrowse,
  FileUploaderDescription,
  FileUploaderDropzone,
  FileUploaderError,
  FileUploaderFileItem,
  FileUploaderFileList,
  FileUploaderFileName,
  FileUploaderFileSize,
  FileUploaderHiddenInput,
  FileUploaderIcon,
  FileUploaderLabel,
  FileUploaderRemoveButton,
  FileUploaderText,
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
  value = [],
}: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      setLocalError(null);
      const newFiles: FileUploaderFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        if (file.size > maxSizeBytes) {
          setLocalError(`File "${file.name}" exceeds ${maxSizeMB}MB limit`);
          return;
        }

        if (value.length + newFiles.length >= maxFiles) {
          setLocalError(`Maximum ${maxFiles} files allowed`);
          break;
        }

        const uploaderFile: FileUploaderFile = {
          file,
          id: generateFileId(),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        };
        newFiles.push(uploaderFile);
      }

      if (newFiles.length > 0) {
        onChange([...value, ...newFiles]);
      }
    },
    [disabled, maxFiles, maxSizeBytes, maxSizeMB, onChange, value]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFiles]
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const { fileId } = e.currentTarget.dataset;
      if (!fileId) return;
      const fileToRemove = value.find((f) => f.id === fileId);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      onChange(value.filter((f) => f.id !== fileId));
      setLocalError(null);
    },
    [onChange, value]
  );

  const displayError = error ?? localError;

  return (
    <FileUploaderWrapper className={className}>
      {label && <FileUploaderLabel>{label}</FileUploaderLabel>}

      <FileUploaderDropzone
        $disabled={disabled}
        $hasError={Boolean(displayError)}
        $isDragOver={isDragOver}
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileUploaderIcon>
          <Upload size={24} />
        </FileUploaderIcon>
        <FileUploaderText>
          Drag files here or <FileUploaderBrowse>browse</FileUploaderBrowse>
        </FileUploaderText>
        {description && <FileUploaderDescription>{description}</FileUploaderDescription>}
      </FileUploaderDropzone>

      <FileUploaderHiddenInput
        accept={accept}
        multiple={multiple}
        ref={inputRef}
        type='file'
        onChange={handleInputChange}
      />

      {displayError && <FileUploaderError>{displayError}</FileUploaderError>}

      {value.length > 0 && (
        <FileUploaderFileList>
          {value.map((uploaderFile) => (
            <FileUploaderFileItem key={uploaderFile.id}>
              <FileUploaderFileName>{uploaderFile.file.name}</FileUploaderFileName>
              <FileUploaderFileSize>{formatFileSize(uploaderFile.file.size)}</FileUploaderFileSize>
              <FileUploaderRemoveButton
                aria-label={`Remove ${uploaderFile.file.name}`}
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
