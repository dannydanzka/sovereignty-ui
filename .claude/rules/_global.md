# Global Rules — sovereignty-ui-lab

> **APPLIES TO**: All files in the lab
> **PURPOSE**: Test harness for `@dannydanzka/sovereignty-ui` on React Native (`mobile` discipline)
> **VERSION**: 1.0 | **UPDATED**: 2026-07-06

---

## DO

- Consume sovereignty-ui through its public barrels ONLY (`@dannydanzka/sovereignty-ui`, `/tokens`, `/hooks`, `/utils`) — never deep-import `src/` paths
- Build every screen on the primitives `Div`/`Span` + token helpers; styled files follow the library's RN-safe CSS rules (flexbox only, `background-color`, no hover/transition/@media/grid, raw text inside Span)
- Keep brand overrides centralized in `src/libs/shared/tokens/brand.ts` (`setSuiTokens` + `createBrandPalette`)
- Demo each RN-ready library component in `GalleryScreen` with all its variants
- Validate before committing: `npm run type-check && npm run lint && npm test && npm run bundle:ios`
- Keep the `file:` symlink install — this repo is the exception to the "lockfile must resolve npm.pkg.github.com" rule
- English for code and docs

## DON'T

- Add business/domain logic, backends, i18n, auth, or analytics — this is a harness, not a product
- Add runtime deps beyond what testing the library requires (current allowance: react-native-safe-area-context, react-native-svg, lucide-react-native, styled-components)
- Hardcode colors/spacing in styled files — token helpers only (raw hex allowed ONLY as icon props in demo screens)
- Fix library bugs here with local workarounds — fix them in `../sovereignty-ui` (they hot-reload via Metro watchFolders)
- Commit `build/` bundles or `ios/Pods` (gitignored)

---

## Reference

- `../sovereignty-ui/.claude/rules/reference/component-standards.md` — RN-safe CSS + dual-platform rules
- `../sovereignty-ui/.claude/plans/react-native-support.md` — RN support plan and status
