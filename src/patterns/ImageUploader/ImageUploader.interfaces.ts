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
  placeholder?: string;
}

export interface StyledUploadAreaProps {
  $disabled: boolean;
  $hasImage: boolean;
  $height: string;
}
