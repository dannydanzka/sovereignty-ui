/**
 * FileUploader Component Interfaces
 */

import type { DropzoneTexts } from '../Dropzone';

export interface FileUploaderFile {
  file: File;
  id: string;
  preview?: string;
}

/** The zone's copy plus the file list's own remove affordance. */
export interface FileUploaderTexts extends DropzoneTexts {
  /** Accessible name of a file row's remove button. */
  removeFile: (fileName: string) => string;
}

export interface FileUploaderProps {
  accept?: string;
  className?: string;
  /** Rendered as the zone's hint line. */
  description?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  /** Cumulative cap: `value` plus new files never exceeds it. */
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  onChange: (files: FileUploaderFile[]) => void;
  /** Neutral English defaults (`FILE_UPLOADER_DEFAULT_TEXTS`) — override with your product's copy. */
  texts?: FileUploaderTexts;
  value?: FileUploaderFile[];
}
