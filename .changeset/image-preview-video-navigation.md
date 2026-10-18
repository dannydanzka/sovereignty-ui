---
'@dannydanzka/sovereignty-ui': minor
---

`ImagePreviewModal` covers what product galleries were hand-rolling around it:

- **`mediaType`** (`'image' | 'video'`, default `'image'`) — a video plays with controls from open
  (web only; native renders images).
- **`onNext` / `onPrevious`** with `nextLabel` / `previousLabel` — arrows appear only when the
  callback is passed, and `ArrowRight` / `ArrowLeft` trigger them.
- **`onDownload`** with `downloadLabel` — a download button next to close, only when asked.

Graduated from DearAdry, whose local copy carried all three and kept a second overlay alive for
them. Every new prop is optional, so existing call sites render exactly as before.
