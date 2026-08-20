/**
 * Dropzone Interfaces
 */

/**
 * Every string the zone can show. Required — the library is language-agnostic, so the consumer
 * brings the copy; there is no default in any language.
 */
export interface DropzoneTexts extends DropzoneRejectionTexts {
  /** Accessible name of the hidden file input (the "browse" affordance). */
  browse: string;
  /** The invitation line inside the zone. */
  placeholder: string;
}

export interface DropzoneProps {
  /** Same syntax as the native attribute (`image/*`, `application/pdf`, `.csv`). Enforced on DROP too. */
  accept?: string;
  className?: string;
  disabled?: boolean;
  /** A refusal the FIELD decided (a bad URL, a failed upload). Shares the slot with the zone's own. */
  error?: string;
  /** Secondary line: what the field expects. Not an error. */
  hint?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  /** Only ever called with files that passed type, size and count. A rejection stays in the zone. */
  onFiles: (files: File[]) => void;
  texts: DropzoneTexts;
}

export interface DropzoneRejectionRules {
  accept?: string;
  maxFiles: number;
  maxSizeMB: number;
}

/** The refusal messages `findDropzoneRejection` composes from. */
export interface DropzoneRejectionTexts {
  tooBig: (fileName: string, maxSizeMB: number) => string;
  tooMany: (maxFiles: number) => string;
  wrongType: (fileName: string) => string;
}
