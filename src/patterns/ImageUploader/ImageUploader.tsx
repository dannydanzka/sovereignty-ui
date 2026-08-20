/**
 * ImageUploader Pattern
 *
 * Click-to-upload image area with local preview; a file can also be DROPPED on
 * it (`accept` is enforced on drop, since the native attribute only filters the
 * picker). Selection hands the File to the consumer via onFileSelect — the
 * actual upload is the consumer's responsibility; reflect progress back
 * through isUploading.
 */

import { Camera, ImageIcon, Loader2 } from 'lucide-react';
import type { DragEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

import type { ImageUploaderProps } from './ImageUploader.interfaces';
import { matchesAccept } from '../Dropzone';

import {
  Container,
  HiddenInput,
  Label,
  LoadingOverlay,
  Overlay,
  Placeholder,
  PlaceholderText,
  PreviewImage,
  UploadArea,
} from './ImageUploader.styled';

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp';

export const ImageUploader = ({
  accept = DEFAULT_ACCEPT,
  changeLabel = 'Change image',
  className,
  currentImageUrl,
  disabled = false,
  height = '160px',
  id,
  isUploading = false,
  label,
  onFileSelect,
  onRejectFile,
  placeholder = 'Click to upload an image',
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const selectFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        setPreviewUrl(preview);
        onFileSelect(file, preview);
      };
      reader.readAsDataURL(file);
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      selectFile(file);
      event.target.value = '';
    },
    [selectFile]
  );

  /** A dropped file skips the picker, so `accept` is enforced here — never silently. */
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled || isUploading) return;
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      if (!matchesAccept(file, accept)) {
        onRejectFile?.(file.name);
        return;
      }
      selectFile(file);
    },
    [accept, disabled, isUploading, onRejectFile, selectFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const displayUrl = previewUrl ?? currentImageUrl;

  return (
    <Container className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <UploadArea
        $disabled={disabled}
        $hasImage={Boolean(displayUrl)}
        $height={height}
        aria-label={displayUrl ? changeLabel : placeholder}
        role='button'
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {displayUrl ? (
          <>
            <PreviewImage alt={label ?? changeLabel} src={displayUrl} />
            {!isUploading && (
              <Overlay>
                <Camera />
              </Overlay>
            )}
          </>
        ) : (
          <Placeholder>
            <ImageIcon />
            <PlaceholderText>{placeholder}</PlaceholderText>
          </Placeholder>
        )}
        {isUploading && (
          <LoadingOverlay>
            <Loader2 />
          </LoadingOverlay>
        )}
      </UploadArea>
      <HiddenInput
        accept={accept}
        aria-hidden='true'
        data-testid='image-uploader-input'
        disabled={disabled}
        id={id}
        ref={inputRef}
        tabIndex={-1}
        type='file'
        onChange={handleFileChange}
      />
    </Container>
  );
};
