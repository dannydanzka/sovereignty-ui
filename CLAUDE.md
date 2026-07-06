# sovereignty-ui-lab

> **Architecture**: Bare React Native 0.86 test harness — NOT a product. Its only job is to exercise `@dannydanzka/sovereignty-ui` on native, live from the local symlink.
> **Stack**: React Native 0.86 (bare) + React 19 + styled-components/native 6 + TypeScript strict + Jest
> **Library under test**: `@dannydanzka/sovereignty-ui` installed as `file:../sovereignty-ui` (symlink — edits in the library hot-reload here via Metro `watchFolders`)
> **Sovereignty**: `.claude/` synced from soberania-del-codigo with discipline `mobile`

---

## What This Repo Is (and Is Not)

- **IS**: the local proving ground for sovereignty-ui's React Native support. Every RN-ready component gets demoed in `GalleryScreen` and validated with `type-check`, Metro bundles, and Jest here BEFORE claiming RN support in the library.
- **IS NOT**: an app with users, business logic, backend, i18n, or releases. No domain code enters this repo. If a screen needs business logic, it belongs in a product, not here.

## How the Local Link Works

```
sovereignty-ui-lab/node_modules/@dannydanzka/sovereignty-ui -> ../../../sovereignty-ui
```

- `metro.config.js`: `watchFolders: [../sovereignty-ui]`, blockList on the library's `node_modules`, `extraNodeModules` forcing react/react-native/styled-components/@babel/runtime from THIS app, `unstable_enableSymlinks: true`.
- `tsconfig.json`: `moduleSuffixes: [".native", ""]` — TS resolves `*.styled.native.ts` and `src/index.native.ts` like Metro does (requires the `react-native` condition FIRST in the library's package.json exports).
- The lockfile here intentionally resolves `file:` — this is the ONE repo where that is correct (products must resolve `https://npm.pkg.github.com/...`).

## Rules for Code in This Repo

- All layout via sovereignty-ui primitives `Div`/`Span` + token helpers (`c()`, `s()`, `ts()`, `tw()`, `tf()`...) in `.styled.ts` files — same discipline as the library's RN-safe CSS (flexbox only, `background-color` not `background`, raw text inside Span).
- Brand overrides live ONLY in `src/libs/shared/tokens/brand.ts` via `setSuiTokens()`/`createBrandPalette()` — this doubles as the multi-tenant theming test.
- New RN-ready library components MUST get a section in `GalleryScreen` (or a new screen) demonstrating all variants.
- Icons: `lucide-react-native` (the native counterpart of the library's web `lucide-react`).

## Essential Commands

```bash
npm start                # Metro (watches ../sovereignty-ui)
npm run ios              # iOS simulator (requires `npm run pods` once)
npm run android          # Android emulator
npm run pods             # bundle install + pod install (ios/)
npm run type-check       # tsc --noEmit (native resolution via moduleSuffixes)
npm run lint             # eslint (0 errors)
npm test                 # Jest (renders App/GalleryScreen with real SUI natives)
npm run bundle:ios       # Headless validation: release bundle to build/ (gitignored)
npm run bundle:android   # Same for Android
```

## Validation Loop for New Library Components

1. In sovereignty-ui: add `Component.styled.native.ts` + export from `src/index.native.ts`, `npm run type-check:native` green.
2. Here: add a `GalleryScreen` section using it.
3. `npm run type-check && npm run lint && npm test && npm run bundle:ios` — all green.
4. Visual check in simulator when possible (`npm run ios` / `npm run android`).

## See Also

- Library RN plan: `../sovereignty-ui/.claude/plans/react-native-support.md`
- Library rules: `../sovereignty-ui/.claude/rules/` (component standards incl. RN-safe CSS)
- Release SOP (library, CI-only): `../sovereignty-ui/.claude/rules/sop/release-via-ci.md`
