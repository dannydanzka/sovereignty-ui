/**
 * FileUploader Constants
 */

import type { FileUploaderTexts } from './FileUploader.interfaces';

/** Neutral, overridable defaults — pass your product's copy through `texts`. */
export const FILE_UPLOADER_DEFAULT_TEXTS: FileUploaderTexts = {
  browse: 'Browse files',
  placeholder: 'Drag files here or browse',
  removeFile: (name) => `Remove ${name}`,
  tooBig: (name, maxSizeMB) => `File "${name}" exceeds ${maxSizeMB}MB limit`,
  tooMany: (maxFiles) => `Maximum ${maxFiles} files allowed`,
  wrongType: (name) => `File "${name}" is not an accepted type`,
};
