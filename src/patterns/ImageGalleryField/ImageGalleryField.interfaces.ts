/**
 * ImageGalleryField Interfaces
 */

import type { DropzoneTexts } from '../Dropzone';

/** Every string the field can show — the zone's copy plus the gallery's own. Required. */
export interface ImageGalleryFieldTexts extends DropzoneTexts {
  /** Rendered after `hint`, from the prop — never written into copy, so it survives the cap moving. */
  capHint: (maxFiles: number) => string;
  /** Accessible name of a thumbnail's promote action. Position included: three identical buttons
   * give a screen reader nothing. */
  makePrimary: (position: number) => string;
  /** The tag on the first image. */
  primary: string;
  /** Accessible name of a thumbnail's remove action. */
  remove: (position: number) => string;
  /** Shown when the injected `upload` rejects. */
  uploadError: string;
  /** The zone's hint while an upload is in flight. */
  uploading: string;
}

export interface ImageGalleryFieldProps {
  /** Same syntax as the native attribute; enforced on drop too (via `Dropzone`). */
  accept?: string;
  className?: string;
  hint?: string;
  label: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onChange: (urls: string[]) => void;
  texts: ImageGalleryFieldTexts;
  /**
   * Where a picked file becomes a URL. Injected rather than imported so the field knows nothing
   * about buckets or folders.
   */
  upload: (file: File) => Promise<string>;
  /** The ordered image URLs. Position 0 IS the thumbnail wherever the consumer shows the record. */
  value: string[];
}
