---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 11 — overlays complete.

- **NotificationToast** and the **NotificationContainer** pattern now render on React Native (styles-only port: icons via the internal module, close button via the Pressable primitive; the container uses `position: absolute` since RN has no `position: fixed`).
- **ImagePreviewModal** renders on native via a dedicated `.native.tsx` on the RN `<Modal>` host with an RN `Image` (gradients become flat translucent scrims).

Web implementations are unchanged (235 tests green). Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes.
