/**
 * ImageGalleryField
 *
 * An ordered set of images a record owns: add (drop or pick, via `Dropzone`), remove, and choose
 * which one is the thumbnail. It reports the FULL ordered array on every change — partial updates
 * are the consumer's API contract, not this field's.
 *
 * `upload` is injected: where a picked file becomes a URL (a bucket, a CDN, a data URI) is the
 * consumer's business. Reordering by dragging is deliberately NOT here: the only order that carries
 * meaning is which image is first, and the promote action moves that one image to the front.
 *
 * All copy arrives via the required `texts` prop — the library has no language.
 */

import { Star, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '../../components/Button';
import { Dropzone } from '../Dropzone';
import { GALLERY_DEFAULTS, GALLERY_ICON_SIZE } from './ImageGalleryField.constants';
import type { ImageGalleryFieldProps } from './ImageGalleryField.interfaces';

import {
  GalleryError,
  GalleryField,
  GalleryHint,
  GalleryItem,
  GalleryLabel,
  PrimarySlot,
  PrimaryTag,
  RemoveSlot,
  Thumbnail,
  ThumbnailGrid,
} from './ImageGalleryField.styled';

const FIRST = 0;
const NONE = 0;

export const ImageGalleryField = ({
  accept = GALLERY_DEFAULTS.ACCEPT,
  className,
  hint,
  label,
  maxFiles = GALLERY_DEFAULTS.MAX_FILES,
  maxSizeMB = GALLERY_DEFAULTS.MAX_SIZE_MB,
  onChange,
  texts,
  upload,
  value,
}: ImageGalleryFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setError(null);
      setUploading(true);
      try {
        const urls = await Promise.all(files.map((file) => upload(file)));
        onChange([...value, ...urls]);
      } catch {
        setError(texts.uploadError);
      } finally {
        setUploading(false);
      }
    },
    [onChange, texts.uploadError, upload, value]
  );

  const handleRemove = useCallback(
    (index: number) => () => onChange([...value.slice(0, index), ...value.slice(index + 1)]),
    [onChange, value]
  );

  /** A move, not a swap: swapping would displace the old primary into this image's slot. */
  const handleMakePrimary = useCallback(
    (index: number) => () => {
      const promoted = value[index];
      if (promoted === undefined) return;
      onChange([promoted, ...value.slice(FIRST, index), ...value.slice(index + 1)]);
    },
    [onChange, value]
  );

  /** The cap is on the SET, not on one pick: 20 already there must leave room for 4, not for 24. */
  const remaining = maxFiles - value.length;

  const renderThumbnail = (url: string, index: number) => {
    const position = index + 1;
    return (
      <GalleryItem key={url}>
        <Thumbnail alt={`${label} ${position}`} src={url} />
        <RemoveSlot>
          <Button
            aria-label={texts.remove(position)}
            icon={<X size={GALLERY_ICON_SIZE} />}
            iconOnly
            shape='circle'
            size='sm'
            title={texts.remove(position)}
            variant='danger'
            onClick={handleRemove(index)}
          />
        </RemoveSlot>
        <PrimarySlot>
          {index === FIRST ? (
            <PrimaryTag>{texts.primary}</PrimaryTag>
          ) : (
            <Button
              aria-label={texts.makePrimary(position)}
              icon={<Star size={GALLERY_ICON_SIZE} />}
              iconOnly
              shape='circle'
              size='sm'
              title={texts.makePrimary(position)}
              variant='secondary'
              onClick={handleMakePrimary(index)}
            />
          )}
        </PrimarySlot>
      </GalleryItem>
    );
  };

  return (
    <GalleryField className={className}>
      <GalleryLabel>{label}</GalleryLabel>
      {value.length ? <ThumbnailGrid>{value.map(renderThumbnail)}</ThumbnailGrid> : null}
      <Dropzone
        accept={accept}
        disabled={uploading || remaining <= NONE}
        hint={uploading ? texts.uploading : undefined}
        maxFiles={Math.max(remaining, FIRST + 1)}
        maxSizeMB={maxSizeMB}
        texts={texts}
        onFiles={handleFiles}
      />
      <GalleryHint>{[hint, texts.capHint(maxFiles)].filter(Boolean).join(' ')}</GalleryHint>
      {error ? <GalleryError>{error}</GalleryError> : null}
    </GalleryField>
  );
};
