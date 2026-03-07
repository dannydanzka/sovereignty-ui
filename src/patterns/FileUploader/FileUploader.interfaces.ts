/**
 * FileUploader Component Interfaces
 */

export interface FileUploaderFile {
  file: File;
  id: string;
  preview?: string;
}

export interface FileUploaderProps {
  accept?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  onChange: (files: FileUploaderFile[]) => void;
  value?: FileUploaderFile[];
}
