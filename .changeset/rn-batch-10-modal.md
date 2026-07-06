---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 10 — Modal on native.

**Modal** now renders on React Native via a dedicated `Modal.native.tsx` built on the RN `<Modal>` host (backdrop, Android back button, fade animation). Both the `default` and `confirm` variants work, reusing the native Button. The web implementation (portal + `document` keydown/scroll-lock + close animation) is UNCHANGED — all 235 web tests pass untouched.

Follow-up noted in the plan: wrap the native `ModalContent` in a ScrollView for long content. Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes.
