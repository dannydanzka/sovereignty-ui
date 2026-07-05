# Exports & Imports

> **Module**: frontend/tooling
> **ESLint**: `custom/import-strategy`, `custom/index-barrel-exports-only`

---

## TL;DR

**DO**:
- Barrel: `export *` or `export type *` ONLY
- Imports: `import { X }` (named only)
- Types: `import type { X }`
- Default: App Router pages ONLY

**DON'T**:
- Named barrel: `export { X }` (breaks pattern)
- Wildcard: `import *` (no tree-shaking)
- Default exports in components/utils
- Selective exports to hide duplicates

---

## Barrel Export Patterns

### Component Barrel

```typescript
// Button/index.ts
export * from './Button';
export * from './Button.interfaces';
// NO styled.ts, NO test.tsx
```

### Type-Only Barrel

```typescript
// interfaces/index.ts
export type * from './user.interfaces';
export type * from './event.interfaces';
```

### Use Case Barrel

```typescript
// create-user/index.ts
export type * from './create-user.interfaces';  // Types first
export * from './create-user.use-case';         // Implementation
```

### Directory Barrel

```typescript
// helpers/index.ts
export * from './error-handling';
export * from './http';
export * from './validation';
```

---

## Import Patterns

```typescript
// ✅ Named imports
import { Button, Input } from '@components';
import { formatDate } from '@utils';

// ✅ Type-only imports
import type { UserEntity } from '@interfaces';
import type { UserRole } from '@domain-types';

// ❌ Wildcard imports (no tree-shaking)
import * as Components from '@components';

// ❌ Runtime import for types
import { UserEntity } from '@interfaces';  // Should be import type
```

---

## Default Exports

```typescript
// ✅ App Router ONLY
// page.tsx
const AdminUsersPage = () => <UserManagerScreen />;
export default AdminUsersPage;

// ❌ Components (use named)
export default Button;  // FORBIDDEN
export const Button = () => {};  // ✅ CORRECT
```

---

## Import Order

1. React imports
2. Next.js imports
3. External libraries
4. Type imports
5. Internal aliases (@utils, @components)
6. Relative imports (./)
7. Styled components (last)

---

## Duplicate Resolution

**Problem**: TS2308 (duplicate exports)

```typescript
// ❌ WRONG - Selective export to hide
export type { User, Event } from './types';  // Skipping Role

// ✅ CORRECT - Fix at source
// 1. Find canonical location (usually @domain-types)
// 2. Remove duplicate from other files
// 3. Import centralized type
import type { Role } from '@domain-types';
// 4. Keep export * in barrels
```

---

## Why export *

- **Tree-shaking**: Bundlers eliminate unused
- **Consistency**: One pattern everywhere
- **Maintainability**: Add file → add one line
- **No decision fatigue**: Always `export *`

---

## Why Named Imports

- **Bundle size**: Bundler knows exactly what's used
- **Clarity**: Explicit imports
- **IDE support**: Better autocomplete

---

## Related

- `core/quality/naming.md` - File naming
- `frontend/presentation/components.md` - Component structure

