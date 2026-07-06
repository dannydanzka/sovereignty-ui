---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 8 — `TextField` primitive and native text-input Forms.

- **New `TextField` primitive** (public, exported from the main + native barrels): renders an `<input>` on web and a `TextInput` on native. Both platforms expose ONE change API — `onValueChange(value)` — so shared component files never touch `event.target.value` (absent on RN). `secureTextEntry`, `multiline`/`rows`, and `type` map to the right web attribute or TextInput prop per platform.
- **Native resolutions for Input, SearchInput, Textarea** — these text inputs now render on React Native. Input keeps its password-visibility toggle (now via the internal icon module). Textarea maps `multiline`/`rows` to TextInput.
- Web `.tsx` for these three was refactored to route through the primitive while keeping the exact public `onChange(value)` API and all rendered markup — all 235 web tests unchanged.

PasswordInput is intentionally not ported yet: its public `onChange` is a raw DOM handler rather than a value callback, so a native version would be a breaking API change (Input already offers a built-in password toggle). No breaking changes here; validated end-to-end in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).
