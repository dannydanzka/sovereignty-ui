/**
 * AvatarUpload Pattern
 *
 * Avatar with click-to-change photo. Selection produces a local preview and
 * hands the File to the consumer via onFileSelect — uploading (Supabase, S3,
 * API route, ...) is the consumer's responsibility; reflect progress back
 * through isUploading.
 */

import { Camera, Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { AvatarUploadProps } from './AvatarUpload.interfaces';

import {
  Avatar,
  AvatarImage,
  AvatarWrapper,
  Container,
  HiddenInput,
  LoadingOverlay,
  Name,
  Overlay,
} from './AvatarUpload.styled';

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp';

export const AvatarUpload = ({
  accept = DEFAULT_ACCEPT,
  changeLabel = 'Change photo',
  className,
  currentPhotoUrl,
  disabled = false,
  initials,
  isUploading = false,
  name,
  onFileSelect,
  size = 'medium',
}: AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        setPreviewUrl(preview);
        onFileSelect(file, preview);
      };
      reader.readAsDataURL(file);

      event.target.value = '';
    },
    [onFileSelect]
  );

  const displayUrl = previewUrl ?? currentPhotoUrl;

  return (
    <Container className={className}>
      <AvatarWrapper
        $disabled={disabled}
        $size={size}
        aria-label={changeLabel}
        role='button'
        onClick={handleClick}
      >
        <Avatar $hasPhoto={Boolean(displayUrl)} $size={size}>
          {displayUrl ? <AvatarImage alt={name ?? changeLabel} src={displayUrl} /> : initials}
        </Avatar>
        {isUploading ? (
          <LoadingOverlay>
            <Loader2 />
          </LoadingOverlay>
        ) : (
          <Overlay>
            <Camera />
          </Overlay>
        )}
      </AvatarWrapper>
      {name && <Name>{name}</Name>}
      <HiddenInput
        accept={accept}
        aria-hidden='true'
        data-testid='avatar-upload-input'
        disabled={disabled}
        ref={inputRef}
        tabIndex={-1}
        type='file'
        onChange={handleFileChange}
      />
    </Container>
  );
};
