/**
 * Dropzone Constants
 */

export const DROPZONE_DEFAULTS = {
  MAX_FILES: 1,
  MAX_SIZE_MB: 5,
} as const;

export const DROPZONE_ICON_SIZE = 24;

export const BYTES_PER_MB = 1024 * 1024;

/**
 * The token shapes an `accept` attribute can carry: any, a wildcard subtype, an exact MIME type,
 * or a filename extension.
 */
export const ANY_TYPE = '*/*';
export const EXTENSION_PREFIX = '.';
export const WILDCARD_SUFFIX = '/*';
