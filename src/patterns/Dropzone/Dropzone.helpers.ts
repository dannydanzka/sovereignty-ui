/**
 * Dropzone Helpers
 *
 * Why `accept` is re-checked here: the native attribute filters the FILE PICKER only. A dropped
 * file ignores it entirely, so without this a PDF lands in an image field and the upload fails
 * later, in a place that cannot explain what happened.
 */

import { ANY_TYPE, BYTES_PER_MB, EXTENSION_PREFIX, WILDCARD_SUFFIX } from './Dropzone.constants';
import type { DropzoneRejectionRules, DropzoneRejectionTexts } from './Dropzone.interfaces';

/** Whether a file satisfies an `accept` attribute, applied to drops and picks alike. */
export const matchesAccept = (file: File, accept?: string): boolean => {
  const tokens = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (!tokens.length) return true;

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token === ANY_TYPE) return true;
    if (token.startsWith(EXTENSION_PREFIX)) return name.endsWith(token);
    if (token.endsWith(WILDCARD_SUFFIX)) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
};

/** The first reason this batch cannot be accepted, in the consumer's words — or null when it can. */
export const findDropzoneRejection = (
  files: readonly File[],
  { accept, maxFiles, maxSizeMB }: DropzoneRejectionRules,
  texts: DropzoneRejectionTexts
): string | null => {
  if (files.length > maxFiles) return texts.tooMany(maxFiles);

  const wrongType = files.find((file) => !matchesAccept(file, accept));
  if (wrongType) return texts.wrongType(wrongType.name);

  const tooBig = files.find((file) => file.size > maxSizeMB * BYTES_PER_MB);
  if (tooBig) return texts.tooBig(tooBig.name, maxSizeMB);

  return null;
};
