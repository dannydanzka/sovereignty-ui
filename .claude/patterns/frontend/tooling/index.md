# Tooling Patterns

> **Module**: frontend/tooling
> **Scope**: ESLint, TypeScript, imports, aliases
> **Updated**: 2026-03-23

---

## Patterns

| Pattern | Purpose | Priority |
|---------|---------|----------|
| `eslint.md` | Custom rules, configuration | High |
| `eslint-rules-reference.md` | 19 custom ESLint rules — Code Sovereignty enforcement via static analysis | High |
| `typescript.md` | Strict mode, tsconfig | High |
| `typescript-error-suppression.md` | Gradual TS migration: `@ts-expect-error` decision flow, documentation, tracking | High |
| `imports.md` | Barrel exports, aliases, import order | High |
| `es6.md` | Arrow functions, destructuring | Low |
| `js-to-ts-migration.md` | Systematic JS→TS migration: delete-and-replace, dependencies-first, no bridges | High |

---

## TL;DR

**Imports order**:
```typescript
// 1. External
import { useState } from 'react';
import styled from 'styled-components';

// 2. Aliases
import { Button } from '@components';
import { useAuth } from '@hooks';

// 3. Relative (same directory only)
import { ComponentProps } from './Component.interfaces';
```

**Barrel exports**: Only `export *` or `export type *`.

**TypeScript**: Strict mode, never `any` (except tests).

---

## When to Consult

- ESLint warnings → `eslint.md`
- ESLint custom rules detail → `eslint-rules-reference.md`
- TypeScript errors → `typescript.md`
- Gradual TS migration → `typescript-error-suppression.md`
- Import/export issues → `imports.md`

---

**Total**: 7 patterns | **Updated**: 2026-04-09
