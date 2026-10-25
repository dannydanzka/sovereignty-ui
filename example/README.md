# example — native proving ground

Bare React Native app whose only job is to exercise `@dannydanzka/sovereignty-ui`
on native, live from the parent folder.

It is the native counterpart of Storybook: web components are demoed with
`yarn dev` at the repo root, native components are demoed here.

## What this is (and is not)

- **IS**: the local proving ground for React Native support. Every RN-ready
  component gets a demo in `src/apps/mod-catalog/demos/` and is validated with `type-check`, Metro
  and Jest here BEFORE claiming RN support in the library.
- **IS NOT**: an app with users, business logic, backend, i18n, or releases. No
  domain code enters this folder. It is never published — the library's
  `package.json` ships `files: ["dist", "src"]` only.

## How the link works

The library installs as `file:..`, which npm resolves to a symlink:

```
example/node_modules/@dannydanzka/sovereignty-ui -> ../../..
```

- `metro.config.js`: `watchFolders: [..]`, blockList on the library's own
  `node_modules`, `extraNodeModules` forcing react / react-native /
  styled-components / @babel/runtime from THIS app, `unstable_enableSymlinks`.
- `tsconfig.json`: `moduleSuffixes: [".native", ""]` — TS resolves
  `*.styled.native.ts` and `src/index.native.ts` the way Metro does (requires the
  `react-native` condition FIRST in the library's `exports`).
- The lockfile here intentionally resolves `file:` — this is the ONE package
  where that is correct (products must resolve `https://npm.pkg.github.com/...`).

## Layout

The same layers as a Soverum mobile app (`dearadry-mobile`), so the harness is also the reference for them.

```
example/
├── index.js                     registers src/app/App
├── src/app/                     App (brand → navigation), navigation (public entry @app/navigation), linking
├── src/apps/mod-catalog/
│   ├── navigation/              Catalog + Demo routes, lazy screens
│   ├── presentation/screens/    CatalogScreen (every demo, grouped) · DemoScreen (one demo)
│   └── demos/                   one folder per native export + DEMOS registry (demos.constants.ts)
├── src/libs/testing/            renderApp
├── scripts/eslint-rules/        the mobile rules (navigation, module boundaries, primitives); the rest come from ../scripts
├── android/  ios/               native projects (module name `example`, URL scheme `sui`)
└── package.json                 private, RN 0.88, npm (the `file:..` link is npm's)
```

A new native export gets a folder in `demos/` and a `DEMOS` entry; `demos.test.tsx` renders every entry.

## Opening a demo without tapping

```bash
xcrun simctl launch <udid> com.example -demo button     # iOS launch argument, no confirmation dialog
xcrun simctl openurl <udid> sui://demo/button           # deep link; iOS asks "Open in…?" once
```

Metro on another port than 8081: `npx react-native start --port 8095`, then point the simulator at it once with
`xcrun simctl spawn <udid> defaults write com.example RCT_jsLocation "localhost:8095"`.

## Commands

Run from this folder.

```bash
npm start                # Metro (watches the library)
npm run ios              # iOS simulator (npm run pods once first)
npm run android          # Android emulator
npm run pods             # bundle install + pod install (ios/)
npm run type-check       # tsc --noEmit (native resolution via moduleSuffixes)
npm run lint             # eslint (--max-warnings 0)
npm test                 # Jest: every demo renders + the lint rules
npm run validate         # type-check + lint + format + test
npm run bundle:ios       # headless validation: release bundle to build/
npm run bundle:android   # same for Android
```

## Adding a component to the gallery

1. In the library: add `Component.styled.native.ts`, export from
   `src/index.native.ts`, `npm run type-check:native` green.
2. Here: add `src/apps/mod-catalog/demos/<Component>Demo/` covering every variant and state, and its
   entry in `DEMOS`.
3. `npm run validate && npm run bundle:ios`.
4. Visual check on a simulator: `xcrun simctl launch <udid> com.example -demo <id>` + a screenshot.

## Rules

- Consume the library through its public barrels only
  (`@dannydanzka/sovereignty-ui`, `/tokens`, `/hooks`, `/utils`) — never
  deep-import `src/` paths.
- Build every screen on the primitives `Div`/`Span` + token helpers; styled files
  follow the library's RN-safe CSS rules (flexbox only, `background-color`, no
  hover/transition/@media/grid, raw text inside `Span`).
- No hardcoded colors or spacing in styled files — token helpers only (raw hex
  allowed ONLY as icon props in demo sections).
- Fix library bugs in the library, not with local workarounds here — they
  hot-reload through Metro `watchFolders`.
- No business/domain logic, backends, i18n, auth, or analytics.
- Don't commit `build/` bundles or `ios/Pods`.
