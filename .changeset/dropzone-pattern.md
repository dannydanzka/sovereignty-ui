---
"@dannydanzka/sovereignty-ui": minor
---

New `Dropzone` pattern, and the uploaders recomposed on top of it.

- **`Dropzone`** (web-only): a drag-and-drop file zone graduated from Trackia, where it replaced
  `FileUploader` at every call site. It validates type, size and count **on drop as well as on
  pick** (the native `accept` attribute only filters the file picker), refuses invalid batches
  visibly, and hands accepted files to the consumer via `onFiles`. All copy arrives through the
  **required** `texts` prop — the library is language-agnostic, so there is no default in any
  language. The zone is a real `<button>` (keyboard activation and focus ring for free).
  `matchesAccept` and `findDropzoneRejection` are exported for reuse.
- **`FileUploader`** now composes `Dropzone` internally: its two known defects are gone (the
  hardcoded `"Drag files here or browse"` copy is now the overridable `texts` prop with neutral
  English defaults in `FILE_UPLOADER_DEFAULT_TEXTS`, and a drop is now filtered by `accept`).
  Behavior notes: batch validation is all-or-nothing (a partial accept no longer happens), the
  zone disables itself once the cumulative `maxFiles` is reached, and the remove button's
  accessible name comes from `texts.removeFile`.
- **`ImageUploader`** accepts a dropped file (previously click-only), enforces `accept` on that
  drop, and reports a refused drop through the new optional `onRejectFile` — never silently.
