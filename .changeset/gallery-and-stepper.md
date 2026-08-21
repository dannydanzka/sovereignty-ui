---
"@dannydanzka/sovereignty-ui": minor
---

Two patterns graduated from Trackia, both with copy via a required `texts` prop (the library has
no language):

- **`ImageGalleryField`** (web-only): an ordered set of images a record owns — add via `Dropzone`
  (drop or pick, `accept` enforced on drop), remove, and promote any image to primary by MOVING it
  to the front (position 0 is the thumbnail). The `upload: (file) => Promise<string>` callback is
  injected, so the field knows nothing about buckets. Reports the full ordered array on every
  change; typed URLs are deliberately not an affordance.
- **`QuantityStepper`** (web-only): a quantity as a − n + pill built on `Card`/`Input`/`Button` —
  one bordered control, not three. The keys step and clamp at one; typed input passes through
  untouched (the caller's schema validates). `hideLabel` keeps the accessible name while removing
  the visual caption for tight rows.
