# sovereignty-ui

> **Architecture**: Publishable component library (`lib` discipline) — NOT an app. No routes, no backend, no framework runtime.
> **Stack**: React 19 (peer >=18) + styled-components 6 + TypeScript strict + tsup + Vitest/RTL + Storybook 8
> **Package**: `@dannydanzka/sovereignty-ui` on GitHub Packages
> **Sovereignty**: `.claude/` synced from the sovereignty repo with discipline `lib` (see `sync-sovereignty.sh`)

---

## Boot Order (autoloaded)

1. **Project rules** → `.claude/rules/_global.md` + `rules/reference/*` + `rules/sop/*` — WHEN/WHERE
2. **Patterns (on-demand)** → `.claude/patterns/{doctrine,core,lib,frontend}/` — HOW (read only when task requires)

Protocol: **Rules → Patterns → Business**.

---

## What This Library Is

The agnostic UI layer of the Soverum ecosystem. Every product (Trackia, DearAdry, FollowMe, Presskit, Desarrollemos, Sovertainty) consumes it so their local components are **business-only compositions of these agnostic pieces**.

**Admission rule**: a component enters this library ONLY if it has zero knowledge of business domains, i18n catalogs, services, or frameworks. Brand-adjacent components (headers, footers) enter only as fully prop/slot-driven patterns with no brand assets.

---

## Stack-Specific Rules

BEFORE writing code:

- Styled files use CSS-var token helpers ONLY (`c()`, `s()`, `sh()`, `ts()`, `tw()`, `tf()`, `tl()`, `tt()`, `el()`, `mo()`) — no hardcoded colors/spacing/shadows
- No ThemeProvider, no React context for theming — CSS custom properties with static fallbacks
- Peer dependencies only (react, react-dom, styled-components) — never bundle them
- No imports from any app codebase, Next.js, Redux, Prisma, Supabase, or i18n libraries
- Every component ships the 5-file structure + story + test (see `rules/reference/component-standards.md`)
- React Native: shared `Component.tsx`; platform styling via `Component.styled.native.ts` (Div/Span primitives, RN-safe CSS: flexbox only, no hover/transition/media/grid, raw text always inside Span); export RN-ready components from `src/index.native.ts`

AFTER writing code:

- TypeScript: `npm run type-check` (web) + `npm run type-check:native` (React Native resolution)
- Lint: `npm run lint` (0 warnings, 22 custom rules)
- Tests: `npm run test`
- Build: `npm run build` (tsup — ESM + CJS + d.ts must succeed)

---

## Architecture Quick Reference

**Flow**: tokens → components (atoms/molecules) → patterns (organisms); hooks/ and utils/ are parallel, dependency-free modules.

```
src/
  tokens/        # Design tokens + CSS var helpers + injectSuiTokens() + createBrandPalette()
                 #   *.native.ts: raw px-value resolution + setSuiTokens() (RN has no CSS vars)
  primitives/    # Div (div ↔ View) and Span (span ↔ Text) — cross-platform building blocks
  components/    # 51+ agnostic components (5-file structure each)
                 #   RN-ready ones add Component.styled.native.ts (same exports, Div/Span based)
  patterns/      # Composed organisms (DataTable, FileUploader, FormField, Pagination, ...)
  hooks/         # Generic React hooks (useModal, usePagination, ...)
  utils/         # Pure functions (array, string, date, format, object)
  index.ts       # Main barrel (public API)
```

**Entry points**: `.` (components+patterns), `/tokens`, `/hooks`, `/utils`. Anything not exported by these barrels is private.

---

## Essential Commands

```bash
npm run dev              # Storybook (port 6006) — the WEB proving ground
npm run lint             # ESLint — 0 warnings required
npm run type-check       # tsc --noEmit
npm run test             # Vitest + RTL
npm run build            # tsup → dist/
npm run build:storybook  # Static Storybook
```

---

## `example/` — the NATIVE proving ground

Storybook demos the library on web; `example/` demos it on native. Bare React
Native app, private, never published (`files: ["dist", "src"]` excludes it).

It is a **separate package** with its own `package.json`, `node_modules` and
React Native toolchain — that is what keeps `react-native` an OPTIONAL peer of
the library instead of a real dependency. Run its commands from inside it:

```bash
cd example && npm install     # links the library as file:.. (symlink)
npm start                     # Metro, watching the library root
npm run ios | android         # simulator / emulator
npm run type-check && npm run lint && npm test && npm run bundle:ios
```

**Rule**: a component may not claim React Native support until it is demoed in
`example/Gallery.tsx` and those four checks pass. See `example/README.md`.

Two boundaries to respect:

- Its `package-lock.json` is deliberately pinned — the harness exists to
  reproduce a known-good dependency set. Loosening it has already broken Jest
  once (an ESM-only `lucide-react-native` minor).
- Root `eslint.config.js` ignores `example/**`; the app lints itself with the
  legacy `@react-native` config (hence `ESLINT_USE_FLAT_CONFIG=false` in its
  lint script — ESLint 8 otherwise discovers the root flat config and ignores
  every file).

---

## Releasing (CI ONLY — never local)

`npm publish` from local ALWAYS fails (local tokens are read-only). Flow:

1. `npx changeset` → branch → commit → push branch
2. `gh pr create` → `gh pr merge --squash --admin` (main is protected)
3. Merge to `main` triggers `release.yml` (changesets version + publish)
4. Verify: `npm view @dannydanzka/sovereignty-ui versions`

See `rules/sop/release-via-ci.md` and sovereignty `core/sops/sovereignty-ui-publish.md`.

---

## Documentation Structure

```
.claude/
├── patterns/     # Synced from sovereignty (discipline: lib) — on-demand
├── rules/        # Project-specific (autoloaded): _global.md, reference/, sop/
├── docs/         # Heavy references (component inventories, audits)
└── plans/        # Active implementation plans (e.g., react-native-support.md)
```
