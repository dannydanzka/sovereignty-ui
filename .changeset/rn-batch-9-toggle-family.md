---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 9 — Checkbox and Toggle on native.

- **Checkbox** and **Toggle** now render on React Native via a dedicated `Component.native.tsx`: a Pressable that toggles on press with a rendered indicator (checkmark icon / positioned thumb). The web implementations are UNCHANGED — they keep their hidden `<input>` (best a11y + form semantics) and CSS-pseudo indicator, so all 235 web tests pass untouched.
- This introduces the sanctioned `.native.tsx` split for the narrow set of components whose interaction/structure genuinely diverges (form controls needing a hidden input, and later overlays/lists). Tooling: web `tsconfig.json` excludes `*.native.*`; `tsconfig.native.json` excludes the split web `.tsx` and ESLint now type-lints against both projects.

Switch and RadioGroup are intentionally not ported: their public `onChange` is a raw DOM event rather than a value callback, so a native version would be a breaking API change (they need a coordinated `onChange(checked)` migration first). No breaking changes here; validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).
