/**
 * Dropzone
 *
 * A drag-and-drop file zone — files in, nothing else. It validates type, size and count (on drop
 * AND on pick — the native `accept` only filters the file picker) and hands accepted files to the
 * consumer through `onFiles`. What a file becomes — a bucket URL, a document row, a parsed CSV —
 * is the consumer's decision, which is why this stays a callback and holds no value.
 *
 * All copy arrives via the required `texts` prop: the library is language-agnostic by admission
 * rule, so there is no default in any language.
 */

import type { DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { DROPZONE_DEFAULTS, DROPZONE_ICON_SIZE } from './Dropzone.constants';
import type { DropzoneProps } from './Dropzone.interfaces';
import { findDropzoneRejection } from './Dropzone.helpers';

import {
  DropzoneHiddenInput,
  DropzoneHint,
  DropzoneInvitation,
  DropzoneRejection,
  DropzoneWrapper,
  DropzoneZone,
} from './Dropzone.styled';

export const Dropzone = ({
  accept,
  className,
  disabled = false,
  error,
  hint,
  maxFiles = DROPZONE_DEFAULTS.MAX_FILES,
  maxSizeMB = DROPZONE_DEFAULTS.MAX_SIZE_MB,
  onFiles,
  texts,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [rejection, setRejection] = useState<string | null>(null);

  const submit = useCallback(
    (list: FileList | null) => {
      const files = list ? Array.from(list) : [];
      if (!files.length) return;

      const problem = findDropzoneRejection(files, { accept, maxFiles, maxSizeMB }, texts);
      setRejection(problem);
      if (problem) return;

      onFiles(files);
    },
    [accept, maxFiles, maxSizeMB, onFiles, texts]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!disabled) setActive(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setActive(false);
      if (disabled) return;
      submit(event.dataTransfer.files);
    },
    [disabled, submit]
  );

  const handleBrowse = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  /** The input is reset so picking the same file twice still fires a change. */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      submit(event.target.files);
      event.target.value = '';
    },
    [submit]
  );

  return (
    <DropzoneWrapper className={className}>
      <DropzoneZone
        $active={active}
        data-testid='dropzone'
        disabled={disabled}
        type='button'
        onClick={handleBrowse}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload size={DROPZONE_ICON_SIZE} />
        <DropzoneInvitation>{texts.placeholder}</DropzoneInvitation>
        {hint ? <DropzoneHint>{hint}</DropzoneHint> : null}
      </DropzoneZone>
      <DropzoneHiddenInput
        accept={accept}
        aria-label={texts.browse}
        disabled={disabled}
        multiple={maxFiles > DROPZONE_DEFAULTS.MAX_FILES}
        ref={inputRef}
        tabIndex={-1}
        type='file'
        onChange={handleInputChange}
      />
      {(rejection ?? error) ? <DropzoneRejection>{rejection ?? error}</DropzoneRejection> : null}
    </DropzoneWrapper>
  );
};
