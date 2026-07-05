# Atomic Colocation Pattern

> **PURPOSE**: Keep code colocated with its only consumer. Move to shared only when a second consumer appears.
> **UPDATED**: 2026-04-05
> **REFERENCE**: `mod-consultas/src/module/pages/Monitoring/` (TASK-ID)

---

## Principle

**If something is used by exactly one screen or component, it lives inside that screen/component's folder.** This applies to hooks, helpers, constants, interfaces, styled-components, tests, and any supporting file.

Colocation reduces indirection, makes dependencies explicit, and makes the codebase self-documenting — everything a component needs is visible in its folder.

---

## Decision Matrix — Where Does Code Live?

| Consumer Count | Location | Example |
|---|---|---|
| **1 screen** | `pages/ScreenName/` | `pages/Monitoring/useMonitoringData/` |
| **1 component** | `common/components/ComponentName/` | `MonitoringHeaderTag/useHeaderColor.ts` |
| **2+ within same module** | `common/{hooks,helpers,constants}/` | `common/hooks/useMonitoringMaskUser/` |
| **Cross-module** | `lib-utils/src/{hooks,helpers,constants}/` | `lib-utils/src/hooks/useUser/` |

**Rule**: Start atomic. Promote only when a second consumer exists. Never pre-extract.

---

## What Gets Colocated

| Type | Naming Convention | Example |
|------|-------------------|---------|
| Hook | `useHookName/` subfolder | `useMonitoringData/useMonitoringData.ts` |
| Helper | `helperName.helper.ts` or `helperName/` | `formatStatus.helper.ts` |
| Constants | `screenName.constants.ts` | `monitoring.constants.ts` |
| Interfaces | `fileName.interfaces.ts` | `useMonitoringData.interfaces.ts` |
| Styled | `ComponentName.styled.ts` | `Monitoring.styled.ts` |
| Test | `fileName.test.ts(x)` | `useMonitoringData.test.tsx` |

### Hook as Subfolder (standard for non-trivial hooks)

```
pages/Monitoring/
├── Monitoring.screen.tsx
├── Monitoring.styled.ts
├── Monitoring.test.tsx
├── useMonitoringData/                ← atomic hook subfolder
│   ├── useMonitoringData.ts
│   ├── useMonitoringData.interfaces.ts
│   ├── useMonitoringData.test.tsx
│   └── index.ts                     ← barrel: export * from './useMonitoringData'
└── index.ts
```

### Simple Helper/Constant (inline — no subfolder needed)

```
common/components/MonitoringHeaderTag/
├── MonitoringHeaderTag.tsx
├── MonitoringHeaderTag.styled.ts
├── MonitoringHeaderTag.test.tsx
├── MonitoringHeaderTag.interfaces.ts
├── getTagColor.helper.ts            ← atomic: only MonitoringHeaderTag uses it
└── index.ts
```

### Component with Multiple Atomic Files

```
common/components/MonitoringForDistributor/
├── MonitoringForDistributor.tsx
├── MonitoringForDistributor.styled.ts
├── MonitoringForDistributor.test.tsx
├── MonitoringForDistributor.interfaces.ts
├── MonitoringForDistributor.constants.ts  ← atomic constants
├── MyDistributionTab/                     ← atomic sub-component
│   ├── MyDistributionTab.tsx
│   ├── MyDistributionTab.test.tsx
│   └── index.ts
├── MyLineageTab/                          ← atomic sub-component
│   ├── MyLineageTab.tsx
│   ├── MyLineageTab.test.tsx
│   └── index.ts
└── index.ts
```

---

## Promotion Protocol

When a second consumer needs the same code:

1. **Verify** the second consumer genuinely needs the same logic (not a similar copy)
2. **Move** from atomic location to shared:
   - Same module → `common/{hooks,helpers,constants}/`
   - Cross-module → `lib-utils/src/`
3. **Update** all import paths
4. **Keep** the same file structure (subfolder with index.ts for hooks, flat for simple helpers)

```
BEFORE (atomic):                         AFTER (promoted to shared):
pages/Monitoring/                        common/hooks/
├── useMonitoringData/                   ├── useMonitoringData/
│   ├── useMonitoringData.ts             │   ├── useMonitoringData.ts
│   ├── useMonitoringData.interfaces.ts  │   ├── useMonitoringData.interfaces.ts
│   └── index.ts                         │   ├── useMonitoringData.test.tsx
                                         │   └── index.ts
```

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct |
|---|---|---|
| Helper in `common/helpers/` used by 1 component | Unnecessary indirection | Keep in component folder |
| Constants in `common/constants/` used by 1 screen | Navigating away from consumer | Keep in screen folder |
| Pre-extracting "just in case" | YAGNI — creates dead abstractions | Extract when second consumer appears |
| Shared hook with 1 consumer | Misleading — looks shared but isn't | Keep atomic until promotion needed |
| Test in separate `__tests__/` folder | Breaks colocation principle | Test next to source: `X.test.tsx` beside `X.tsx` |

---

## Legacy: `pageComponents/` Folder

`module/pageComponents/` is a legacy convention where screen-level components were extracted but not moved to `common/components/`. During migration, these should be evaluated:

- If used by 1 screen → move into that screen's folder (atomic)
- If used by 2+ screens → move to `common/components/` (shared)

**Reference**: `mod-consultas/src/module/pageComponents/` has a TODO for this migration.

---

## See Also

- `presentation/components.md` — 5-file component structure
- `presentation/hooks.md` — Hook patterns and composition
- `business/sops/new-component.md` — SOP for creating new components (checklist, folder structure, naming)
- `tooling/js-to-ts-migration.md` — Migration guide with atomic colocation reference
