/**
 * AvatarUpload Pattern Interfaces
 */

export type AvatarUploadSize = 'large' | 'medium' | 'small';

export interface AvatarUploadProps {
  accept?: string;
  changeLabel?: string;
  className?: string;
  currentPhotoUrl?: string | null;
  disabled?: boolean;
  initials: string;
  isUploading?: boolean;
  name?: string;
  onFileSelect: (file: File, previewUrl: string) => void;
  size?: AvatarUploadSize;
}

export interface StyledAvatarWrapperProps {
  $disabled: boolean;
  $size: AvatarUploadSize;
}

export interface StyledAvatarProps {
  $hasPhoto: boolean;
  $size: AvatarUploadSize;
}
