/**
 * ImageUploader Pattern Interfaces
 */

export interface ImageUploaderProps {
  accept?: string;
  changeLabel?: string;
  className?: string;
  currentImageUrl?: string | null;
  disabled?: boolean;
  height?: string;
  id?: string;
  isUploading?: boolean;
  label?: string;
  onFileSelect: (file: File, previewUrl: string) => void;
  /**
   * Called when a DROPPED file does not satisfy `accept` (the native attribute only filters the
   * picker). Surface it — a silent refusal is an affordance the user cannot see.
   */
  onRejectFile?: (fileName: string) => void;
  placeholder?: string;
}

export interface StyledUploadAreaProps {
  $disabled: boolean;
  $hasImage: boolean;
  $height: string;
}
