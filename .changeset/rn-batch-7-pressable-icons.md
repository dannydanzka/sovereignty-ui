---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 7 — interaction primitive, icon module, and 4 more native components.

- **New `Pressable` primitive** (public, exported from the main + native barrels): renders a real `<button>` on web and a `TouchableOpacity` on native. The native resolution maps the shared web props `onClick`→`onPress`, `disabled`, and `aria-label`→`accessibilityLabel`, so interactive components stay a single shared `.tsx`.
- **Internal icon module** (`src/internal/icons`): components now resolve icons through one path that Metro swaps from `lucide-react` (web) to `lucide-react-native` (native). Added `lucide-react-native` and `react-native-svg` as OPTIONAL peer dependencies (native consumers install them; web is unaffected).
- **Native resolutions for Button, Card, Alert, ProgressBar** — these now render on React Native (via `*.styled.native.ts`) in addition to web. `Button` wraps its label in a Span so native renders text correctly; the change is web-transparent (all 235 web tests unchanged).

No breaking changes: web output, public component APIs, and existing `--sui-*` tokens are untouched. Validated end-to-end in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).
