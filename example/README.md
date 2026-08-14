# example — native proving ground

Bare React Native app whose only job is to exercise `@dannydanzka/sovereignty-ui`
on native, live from the parent folder.

It is the native counterpart of Storybook: web components are demoed with
`yarn dev` at the repo root, native components are demoed here.

## What this is (and is not)

- **IS**: the local proving ground for React Native support. Every RN-ready
  component gets demoed in `Gallery.tsx` and validated with `type-check`, Metro
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

Flat on purpose — a harness has no layers to separate.

```
example/
├── App.tsx            app shell (SafeArea + StatusBar)
├── Gallery.tsx        every RN-ready component, one section each
├── Gallery.styled.ts  layout via Div/Span + token helpers
├── brand.ts           setSuiTokens() — also the multi-tenant theming test
├── android/  ios/     native projects (app id: com.example)
└── package.json       private, name "example"
```

## Commands

Run from this folder.

```bash
npm start                # Metro (watches the library)
npm run ios              # iOS simulator (npm run pods once first)
npm run android          # Android emulator
npm run pods             # bundle install + pod install (ios/)
npm run type-check       # tsc --noEmit (native resolution via moduleSuffixes)
npm run lint             # eslint
npm test                 # Jest
npm run bundle:ios       # headless validation: release bundle to build/
npm run bundle:android   # same for Android
```

## Adding a component to the gallery

1. In the library: add `Component.styled.native.ts`, export from
   `src/index.native.ts`, `npm run type-check:native` green.
2. Here: add a `Section` to `Gallery.tsx` using it, covering all variants.
3. `npm run type-check && npm run lint && npm test && npm run bundle:ios`.
4. Visual check in a simulator when possible.

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
