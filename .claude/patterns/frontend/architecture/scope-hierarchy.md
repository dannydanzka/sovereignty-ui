# Scope Hierarchy — Atomic Architecture

> **PURPOSE**: Decide where a helper, hook, interface, constant,
> subcomponent, or styled-component should live based on the number
> and location of its consumers.
> **APPLIES TO**: your-project (Lerna monorepo) and your-project (React Native).
> **UPDATED**: 2026-04-22

---

## The three scopes

```
┌─────────────────────────────────────────────────────────┐
│  Element-local                                          │
│    Consumer: the owning component only (1 consumer)    │
│    Lives next to the component file                    │
├─────────────────────────────────────────────────────────┤
│  Common (module-local)                                  │
│    Consumer: multiple files inside the SAME module     │
│    Lives in `src/common/` of the module                │
├─────────────────────────────────────────────────────────┤
│  Library (cross-module)                                 │
│    Consumer: multiple modules                           │
│    Lives in `lib-ui/`, `lib-utils/`, `lib-services/`   │
└─────────────────────────────────────────────────────────┘
```

**Principle**: start at the smallest scope. Promote upward only when
a second consumer appears — never preemptively.

---

## Decision tree

```
Is it consumed by a second file?
├── NO  → ELEMENT-LOCAL (next to the .tsx)
└── YES → Is the second consumer inside the same module?
          ├── YES → COMMON (src/common/ of the module)
          └── NO  → LIBRARY (lib-ui | lib-utils | lib-services)
```

Applied per artifact type:

| Artifact | Element-local | Common | Library |
|----------|---------------|--------|---------|
| **Interfaces** | `Foo.interfaces.ts` next to `Foo.tsx` | `src/common/interfaces/` | `lib-utils/src/models/` |
| **Helpers** | `Foo.helpers.ts` next to `Foo.tsx` | `src/common/helpers/<domain>/` | `lib-utils/src/helpers/<domain>/` |
| **Hooks** | `useFooLocal.ts` next to `Foo.tsx` | `src/common/hooks/useFoo/` | `lib-utils/src/hooks/useFoo/` |
| **Constants** | inline `const` in the `.tsx` | `src/common/constants/` | `lib-utils/src/constants/` |
| **Styled** | `Foo.styled.ts` next to `Foo.tsx` | `src/common/components/<Name>/<Name>.styled.ts` | `lib-ui/src/components/<Name>/<Name>.styled.ts` |
| **Subcomponents** | `SubFoo/` folder inside parent's folder | `src/common/components/<Name>/` | `lib-ui/src/components/<Name>/` |
| **Selectors** | N/A (selectors always touch the reducer) | `src/state/store/selectors/<slice>/` | `lib-utils/src/state/store/selectors/<slice>/` |

---

## Element-local structure

A component owns a folder. Everything used only by that component lives
inside its folder:

```
MyProfile/
├── MyProfile.screen.tsx              # Default export (required by React.lazy)
├── MyProfile.interfaces.ts           # Props + local types (NewAddressData, effect args)
├── MyProfile.styled.ts               # Styled-components
├── MyProfile.test.tsx                # Tests
├── __snapshots__/
│   └── MyProfile.test.tsx.snap
├── index.ts                          # Re-export default + types
│
├── AccountSecurity/                  # Subcomponent (only used by MyProfile)
│   ├── AccountSecurity.tsx
│   ├── AccountSecurity.interfaces.ts
│   ├── AccountSecurity.styled.ts
│   ├── AccountSecurity.test.tsx
│   └── index.ts
│
└── ModalAddAddress/
    ├── ModalAddAddress.tsx
    ├── AddAddress/                   # Nested subcomponent (only used by ModalAddAddress)
    │   ├── AddAddress.tsx
    │   └── ...
    └── ...
```

Rule: a subcomponent lives **one level below** its parent if the parent
is its only consumer. If another page/screen starts using it, it is
promoted to `src/common/components/`.

---

## Common (module-local) structure

```
packages/mod-<name>/src/common/
├── components/
│   └── <ComponentName>/              # 5-file structure
├── constants/
│   ├── index.ts                      # Barrel
│   └── actionTypes.ts                # `as const` strings
├── helpers/
│   ├── index.ts
│   └── <domain>/
│       ├── index.ts
│       ├── <helper>.ts
│       └── <helper>.test.ts
├── hooks/
│   ├── index.ts
│   └── useFoo/
│       ├── useFoo.ts
│       ├── useFoo.interfaces.ts
│       ├── useFoo.test.tsx
│       └── index.ts
└── interfaces/
    ├── index.ts                      # Barrel (`export *`)
    ├── <domain>.interfaces.ts
    └── ...
```

**Promotion trigger**: when a second file inside the module imports
the artifact. At that moment:
1. Move the file from element-local to `src/common/<category>/`
2. Add to the category's barrel (`index.ts`)
3. Update imports in both old and new consumers to the alias path
   (`@common/hooks/useFoo`, `@common/helpers/...`, etc.)

---

## Library (cross-module) structure

```
packages/
├── lib-services/src/<domain>/         # API services + utils (axios, handleYOUR-PROJECTRequest)
├── lib-ui/src/components/<Component>/ # Shared UI primitives + composites
├── lib-utils/src/
│   ├── constants/                    # Cross-module constants (UserType, etc.)
│   ├── helpers/                      # Cross-module helpers (buildAddressLine, dateManager, etc.)
│   ├── hooks/                        # Cross-module hooks (useBlueBackground, useSpecialUserTag, etc.)
│   ├── models/                       # Interfaces (User, Credit, etc.)
│   └── state/store/                  # Shared actions, reducers, sagas, selectors
```

**Promotion trigger**: when a second **module** imports the artifact.
At that moment:
1. Move to the right `lib-*` package
2. Run `yarn build:lib` to regenerate `.d.ts`
3. Update imports in every consumer to the `@your-org/<lib>/lib/*` alias
4. Delete the now-unused `common/` version

---

## Anti-patterns

| Anti-pattern | Why it's wrong | Correct action |
|--------------|---------------|----------------|
| Placing a one-consumer interface in `common/interfaces/` "in case we need it" | Pollutes the module surface, forces future consumers to discover via barrel even though the type is specific | Keep it element-local until a second consumer appears |
| Putting a multi-module helper in `src/common/helpers/` of one module, then re-importing from another module via relative paths | Breaks the `mod-* ↔ mod-*` no-cross-import rule | Move to `lib-utils/src/helpers/` |
| Creating `src/common/hooks/useFoo` when only `Foo.screen.tsx` uses it | Premature promotion, larger barrel, harder to delete | Keep as `useFooLocal.ts` next to `Foo.screen.tsx` |
| A styled-component in `common/components/` that only one screen uses | Clutters the shared surface | Element-local `Foo.styled.ts` |
| Element-local file imported by a sibling | Violates the "1 consumer" rule | Promote to `common/` |

---

## How to verify a promotion is justified

Before moving a file from element-local → common or common → lib:

```bash
# Count consumers across the module
grep -rn "from.*<FileName>" packages/mod-<module>/src/ | wc -l

# Count consumers across all modules
grep -rn "from.*<FileName>" packages/ | wc -l
```

Rules:
- 1 consumer → stay element-local
- 2+ consumers in the same module → `common/`
- 2+ consumers across modules → `lib-*`

---

## Barrel files

Each scope has barrel `index.ts` to expose the public surface.
Barrels are **additive** — never remove exports without migrating
consumers first.

| Scope | Barrel | Convention |
|-------|--------|------------|
| Element | `MyProfile/index.ts` | `export { default } from './MyProfile.screen'; export type * from './MyProfile.interfaces';` |
| Common | `common/hooks/index.ts` | `export * from './useFoo';` |
| Library | `lib-utils/src/hooks/index.ts` | `export * from './useFoo';` |

---

## Named vs default exports

| Location | Convention | Reason |
|----------|-----------|--------|
| `module/pages/*.screen.tsx` | `export default` (+ optional named for tests) | Required by `React.lazy()` |
| Everything else | Named exports only | ESLint enforces; enables tree-shaking and refactors |

---

## See also

- `rules/_global.md` — DO/DON'T cross-module imports
- `patterns/frontend/presentation/components.md` — 5-file component structure
- `patterns/frontend/presentation/hooks.md` — Hook conventions
- `patterns/frontend/infrastructure/helpers.md` — Helper conventions
- `rules/reference/architecture.md` — Tech stack and aliases
- `rules/reference/build-system.md` — `src/` vs `lib/` dual-folder
