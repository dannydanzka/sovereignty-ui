# ESLint Custom Rules

> **Philosophy**: Code Sovereignty enforcement through static analysis
> **Rules**: 19 custom rules (5 unified consolidations)
> **Version**: 3.0 | **Updated**: 2026-01-19

---

## 🌍 Code Sovereignty: The Foundation

These ESLint rules enforce **Code Sovereignty** - an architectural philosophy where each layer has sovereignty over its domain, like nations at peace.

### The Analogy

| Coupled (War) | Sovereign (Peace) |
|---------------|-------------------|
| UI invades Database | UI speaks through treaties (interfaces) |
| Changes cascade everywhere | Changes isolated to their layer |
| Circular dependencies | Clear borders, one-way dependencies |
| Testing requires entire system | Each layer testable in isolation |

### 6 Sovereignty Principles → ESLint Rules

| Principle | Rule | What It Enforces |
|-----------|------|------------------|
| **Territorial Integrity** | `architecture-boundaries` | Each layer owns its domain exclusively |
| **Non-Intervention** | `architecture-boundaries` | Dependencies point inward only |
| **Self-Sufficiency** | `enforce-hook-composition` | Modules self-sufficient within domain |
| **Clear Borders** | `use-case-policy` | Interfaces = treaties between layers |
| **Trade Agreements** | `import-strategy` | Data flows through defined protocols |
| **Secure Trade** | `no-direct-service-calls` | Request what you need, receive exactly that |

**Full Philosophy**: `~/.claude/patterns/code-sovereignty-patterns.md`

---

## 📦 Rule Categories (19 Rules)

### Architecture (Sovereignty Enforcement)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `architecture-boundaries` ⭐ | Context isolation + layer hierarchy + domain purity | Territorial Integrity |
| `use-case-policy` ⭐ | Arrow functions, no direct repo imports | Clear Borders |
| `no-direct-service-calls` | Redux flow mandatory | Secure Trade |

### Imports (Border Control)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `import-strategy` ⭐ | Barrel vs granular, alias redirects | Trade Agreements |
| `import-order` | Consistent import organization | Trade Agreements |
| `index-barrel-exports-only` | index.ts = `export *` only | Clear Borders |

### Components (Self-Sufficiency)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `no-native-html` | Styled-components only | Self-Sufficiency |
| `design-tokens-policy` ⭐ | No hardcoded colors/spacing | Self-Sufficiency |
| `component-organization` ⭐ | Types in .interfaces.ts | Clear Borders |
| `require-use-client-directive` | Auto-detect 'use client' | Territorial Integrity |
| `no-emojis-in-jsx` | No inline emojis | Self-Sufficiency |

### Code Quality (Domain Purity)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `code-size-limits` ⭐ | File/function/JSX limits | Modularization |
| `enforce-hook-composition` | Prevent over-complex hooks | Self-Sufficiency |
| `no-redux-in-components` | Use useAuth, not redux | Secure Trade |

### Code Style (Treaty Compliance)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `comments-policy` | JSDoc headers, no obvious comments | Documentation |
| `no-underscore-prefix` | Zero tolerance `_unused` | Clean Code |
| `no-try-catch-abuse` | Proper error handling | Error Flow |
| `no-eslint-disable` | No lint suppression | Discipline |

### Testing (Quality Assurance)

| Rule | Purpose | Principle |
|------|---------|-----------|
| `essential-testing` | Prevent verbose tests | Essential Testing |

⭐ = Unified consolidation (replaces multiple deprecated rules)

---

## 🔗 Documentation Chain

```
Code Sovereignty Philosophy (WHY)
     │
     ├── ~/.claude/patterns/code-sovereignty-patterns.md ⭐
     │
     └── Enforcement (HOW)
          │
          ├── ESLint Rules (this directory)
          │    └── 19 custom rules
          │
          ├── TypeScript (tsconfig.json)
          │    └── Strict mode, path aliases
          │
          └── Reference Docs
               ├── ~/.claude/framework/ESLINT-RULES-REFERENCE.md
               ├── ~/.claude/patterns/eslint-custom-rules-patterns.md
               └── ~/.claude/standards/ESLINT-STANDARDS.md
```

---

## 🚀 Quick Start (New Projects)

### 1. Copy Rules

```bash
cp -r scripts/eslint-rules/ /path/to/new-project/scripts/eslint-rules/
```

### 2. Import in eslint.config.js

```javascript
import { architectureBoundariesRule } from './scripts/eslint-rules/architecture-boundaries.js';
import { useCasePolicyRule } from './scripts/eslint-rules/use-case-policy.js';
// ... import all rules

export default [
  {
    plugins: {
      custom: {
        rules: {
          'architecture-boundaries': architectureBoundariesRule,
          'use-case-policy': useCasePolicyRule,
          // ... all rules
        },
      },
    },
    rules: {
      'custom/architecture-boundaries': 'warn',
      'custom/use-case-policy': 'warn',
      // ... all rules
    },
  },
];
```

### 3. Adapt Context Paths (if needed)

In `architecture-boundaries.js`, adjust `getCurrentContext()`:

```javascript
const getCurrentContext = () => {
  // Adjust for your project structure
  if (filename.includes('/modules/user/')) return 'user';
  if (filename.includes('/modules/order/')) return 'order';
  if (filename.includes('/shared/')) return 'shared';
  return null;
};
```

---

## 📋 Rule Details

### architecture-boundaries (Unified v3.0)

**Consolidates**: `no-cross-context-imports` + `no-cross-layer-imports` + `no-domain-framework-deps`

**Three Sovereignty Principles**:

1. **Context Isolation**: admin ↔ public ↔ auth cannot import each other
2. **Layer Hierarchy**: Domain ← Application ← Infrastructure ← Presentation
3. **Domain Purity**: No React, Next.js, Prisma, Redux in domain

```typescript
// ❌ Cross-context (Territorial Invasion)
import { AdminComponent } from '@apps/admin/components';
// Error: Cross-context import forbidden (public ↔ admin). Move shared code to libs/.

// ❌ Cross-layer (Dependency Violation)
// In domain layer:
import { prisma } from '@database';
// Error: domain cannot import infrastructure.

// ❌ Domain impurity (Framework Contamination)
// In use-case:
import { useState } from 'react';
// Error: Domain layer cannot import 'react'. Domain must be pure.
```

---

### use-case-policy (Unified v3.0)

**Consolidates**: `enforce-use-case-pattern` + `enforce-use-case-isolation`

**Philosophy**: Pure business logic in stateless arrow functions

```typescript
// ✅ CORRECT Pattern
export const executeGetUsers = async (params: Params): Promise<Response> => {
  const authResult = await validateAndGetUser(params.request, [ADMIN]);
  return { success: true, data: await userRepository.findMany(filters) };
};

// ❌ FORBIDDEN
export class GetUsersUseCase { }           // Classes
export function executeGetUsers() { }       // Function keyword
this.doSomething();                         // 'this' keyword
import { userRepo } from './user.repo';     // Direct repo import
```

---

### import-strategy (Unified v2.1)

**Philosophy**: One rule to define all "border crossing" policies

```
┌─────────────────────────────────────────────────────────────┐
│  INSIDE a module (@helpers, @components, etc.)              │
│  ─────────────────────────────────────────────────────────  │
│  ✅ Use relative imports (max 2 levels): ../logger          │
│  ❌ DON'T use your own barrel: @helpers (creates cycle!)    │
│  ✅ Can use OTHER barrels: @constants, @utils               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  OUTSIDE a module                                           │
│  ─────────────────────────────────────────────────────────  │
│  ✅ Use barrel imports: @helpers                            │
│  ❌ DON'T use granular: @helpers/logger                     │
│  ❌ DON'T use deep relative (3+ levels): ../../../          │
└─────────────────────────────────────────────────────────────┘
```

---

### design-tokens-policy (Unified v3.0)

**Consolidates**: `no-hardcoded-colors` + `no-hardcoded-spacing`

**Philosophy**: Design system compliance through static analysis

```typescript
// ❌ FORBIDDEN
background: #FFFFFF;        // Hardcoded hex
padding: 16px;              // Hardcoded spacing

// ✅ REQUIRED
background: ${color.white};
padding: ${spacing.sm};
```

---

## ✅ Validation

```bash
yarn lint                    # Run all rules
yarn lint --fix              # Auto-fix where possible
npx eslint src --rule 'custom/architecture-boundaries: error'
```

---

## 📚 Related Documentation

### Philosophy (WHY)
- `~/.claude/patterns/code-sovereignty-patterns.md` ⭐ - Core philosophy
- `~/.claude/framework/CODE-SOVEREIGNTY-REFERENCE.md` - Complete reference

### Patterns (HOW)
- `~/.claude/patterns/eslint-custom-rules-patterns.md` - Rule implementation
- `~/.claude/patterns/use-case-patterns.md` - Use case pattern
- `~/.claude/patterns/exports-imports.md` - Import/export patterns

### Standards (WHAT)
- `~/.claude/framework/ESLINT-RULES-REFERENCE.md` - Complete rule reference
- `~/.claude/standards/ESLINT-STANDARDS.md` - ESLint configuration

### Quick Fixes
- `~/.claude/framework/ESLINT-RULES-REFERENCE.md#quick-fixes-reference` - Fix patterns

---

## 🏗️ Rule Template

```javascript
/**
 * ESLint Rule: your-rule-name
 *
 * SOVEREIGNTY PRINCIPLE: [Which principle this enforces]
 * PHILOSOPHY: [What this rule enforces and why]
 *
 * @reviewed YYYY-MM-DD
 */

/** @type {import('eslint').Rule.RuleModule} */
export const yourRuleNameRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Rule description',
      category: 'Clean Architecture',
      recommended: true,
    },
    messages: {
      violation: '{{ message }}',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    // Skip exemptions
    const isTestFile = /\.(test|spec)\.(ts|tsx)$/.test(filename);
    if (isTestFile) return {};

    return {
      ImportDeclaration(node) {
        // Rule logic
        context.report({
          node,
          messageId: 'violation',
          data: { message: 'Your error message' },
        });
      },
    };
  },
};
```

---

## 📊 Consolidation History

### v3.0 (2026-01-19) - Major Consolidation

| Unified Rule | Replaces | Lines Saved |
|--------------|----------|-------------|
| `architecture-boundaries` | 3 rules | ~200 |
| `code-size-limits` | 3 rules | ~150 |
| `design-tokens-policy` | 2 rules | ~100 |
| `use-case-policy` | 2 rules | ~80 |
| `component-organization` | 2 rules | ~60 |

**Total**: 12 rules → 5 unified rules (~600 lines saved)

### v2.1 (2026-01-18)

- `comments-policy`: Unified 3 comment rules
- `import-strategy`: Unified 2 import rules

---

**Maintained by**: Development Team
**Philosophy**: Code Sovereignty
**Mirror Projects**: All projects share this configuration
