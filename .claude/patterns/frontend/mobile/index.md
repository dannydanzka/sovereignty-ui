# Mobile — React Native / Expo

> **Status**: Active
> **Scope**: React Native mobile-specific patterns
> **Updated**: 2026-03-11

---

## Stack

| Aspect | Technology |
|--------|-----------|
| Framework | React Native 0.81+ / React 19+ |
| Language | TypeScript (gradual migration) |
| State | Redux Toolkit configureStore + Sagas (thunk disabled) |
| Styling | styled-components with RN primitives (View, Text, TouchableOpacity) |
| Navigation | React Navigation v7 |
| Testing | Jest 29 + @testing-library/react-native |
| Build | Metro Bundler + Fastlane (iOS/Android) |

---

## App Architecture Variants

### Single App (Flat Modules)

```
src/
├── modules/               # Business modules (~20)
│   └── [Module]/
│       ├── pages/         # Screen components
│       ├── components/    # Module-specific UI
│       ├── store/         # Module Redux (actions, reducers, sagas)
│       ├── models/        # Data models
│       └── constants/     # Module constants
├── navigation/            # React Navigation v7
├── services/              # API services (domain-organized)
├── state/                 # Global Redux state
├── ui/                    # Shared UI layer (components, theme, styles)
└── utils/                 # Shared utilities (helpers, hooks, constants)
```

| Aspect | Detail |
|--------|--------|
| Module naming | PascalCase directories (`Cart/`, `Auth/`, `Product/`) |
| State | Module-level `store/` + global `state/` |
| Services | Flat `services/{domain}/` with factory pattern |
| Config | `config/*.json` (default, qa, lab, prod) |

### Modular App (Apps + Libs)

```
src/
├── apps/                  # Business modules (mod-*)
│   ├── mod-auth/
│   ├── mod-orders/
│   ├── mod-consultant/
│   ├── mod-financing/
│   └── ...               # ~13 modules
├── libs/                  # Shared libraries
│   ├── core/             # Core utilities
│   ├── domain/           # Domain entities
│   ├── services/         # API services
│   ├── store/            # Centralized Redux state
│   ├── ui/               # Shared UI components
│   └── test-utils/       # Testing utilities
├── app/                   # App shell (entry point, providers)
└── @types/               # Global type declarations
```

| Aspect | Detail |
|--------|--------|
| Module naming | kebab-case with `mod-` prefix (`mod-auth/`, `mod-orders/`) |
| State | Centralized in `libs/store/` |
| Services | Centralized in `libs/services/` |
| Config | Environment files (`.env.dev`, `.env.qa`, etc.) |

---

## Data Flow

```
SERVICE → SAGA → REDUCER → ACTION-TYPES → SELECTORS → HOOKS → SCREENS/COMPONENTS
                                                         ↓
                                              HELPERS / CONSTANTS / INTERFACES
```

---

## Shared with Web

Mobile projects consume the same sovereignty patterns as web for:

- **Domain layer** — Entities, Use Cases (pure, framework-agnostic)
- **Infrastructure layer** — Redux state, services, repositories
- **Presentation layer** — Component structure, hooks
- **Testing** — Jest + RTL patterns
- **Tooling** — ESLint rules, TypeScript strict mode
- **Context Sovereignty** — Each context owns its ecosystem

---

## Mobile-Specific Patterns

| Pattern | File | Description |
|---------|------|-------------|
| Navigation | [navigation.md](navigation.md) | React Navigation v7 — Stack, Drawer, Tabs, deep linking, TypeScript types |
| Service Layer | [service-layer.md](service-layer.md) | Factory pattern + centralized config injection (config/default.json) |
| Error Handling | [error-handling.md](error-handling.md) | Full error chain: backend → AppError → sagaHandler → i18n → UI |

---

## Key Differences from Web

| Aspect | Web (Monorepo) | Mobile (React Native) |
|--------|----------------|----------------------|
| Structure | Lerna/NX monorepo (`packages/` or `apps/`) | Single app (`src/`) |
| Build | Webpack/NX → compiled assets | Metro Bundler (no compilation) |
| Styling | styled-components (HTML: `div`, `span`) | styled-components (RN: `View`, `Text`) |
| Navigation | React Router 6 or Next.js App Router | React Navigation v7 |
| Config | DefinePlugin / env files | `config/*.json` or `.env.*` files |
| i18n | Multi-file per package | Single file (`es.json`) |
| Package manager | yarn (Lerna) or npm (NX) | npm |
| Testing lib | @testing-library/react | @testing-library/react-native |

---

## Pending (to be defined)

| Topic | Status |
|-------|--------|
| Native module integration | Pending |
| Platform-specific components (iOS vs Android) | Pending |
| Performance optimization | Pending |
| Offline-first patterns | Pending |
| Push notifications pattern | Pending |
| Analytics pattern (Amplitude) | Pending |

---

## Shared UI Library — sovereignty-ui on React Native

`@dannydanzka/sovereignty-ui` ships dual-platform components: one shared `Component.tsx`, web styles in `Component.styled.ts`, native resolution in `Component.styled.native.ts` built on the primitives `Div` (View) and `Span` (Text). Theming on native uses a runtime token registry (`setSuiTokens`) instead of CSS variables; the token-helper API (`c()`, `s()`, ...) is identical on both platforms.

- Library plan + status: `sovereignty-ui/.claude/plans/react-native-support.md`
- RN-safe CSS rules: `projects/lib/sovereignty-ui/rules/` (component-standards)
- Local test harness: **sovereignty-ui-lab** (`projects/mobile/sovereignty-ui-lab/`) — bare RN 0.86 consuming the library via `file:` symlink + Metro `watchFolders`

---

## Related

- `frontend/index.md` — Web frontend patterns (shared concepts)
- `frontend/presentation/components.md` — Component structure
- `frontend/infrastructure/state/redux.md` — State management
- `frontend/infrastructure/state/context-sovereignty.md` — Context ownership
- `frontend/testing/jest.md` — Jest patterns
