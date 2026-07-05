# Components

> **Module**: frontend/presentation
> **ESLint**: `custom/no-native-html`, `custom/component-organization`

---

## TL;DR

**DO**:
- 5-file structure: .tsx, .interfaces.ts, .styled.ts, .test.tsx, index.ts
- 'use client' in .tsx and .styled.ts (hooks/styled)
- Transient props ($-prefix): `$isActive`, `$variant`
- Flat maps ONLY (NO theme context)
- Render functions inside component

**DON'T**:
- Native HTML elements (styled-components ONLY)
- Inline functions in props (use useCallback)
- Business logic in components (use hooks)
- Direct API calls (use Redux)
- Theme context access (SSR crash)

---

## 5-File Structure

```
ComponentName/
├── ComponentName.tsx           # 'use client' + logic
├── ComponentName.interfaces.ts # Types (optional)
├── ComponentName.styled.ts     # 'use client' + styles
├── ComponentName.test.tsx      # Tests
└── index.ts                    # export *
```

**Why**: Separation of concerns, maintainability, testability.

---

## Component Types

| Type | Location | Naming |
|------|----------|--------|
| UI Components | libs/presentation/components/ | ComponentName |
| Admin Screens | apps/admin/presentation/screens/ | NameScreen |
| Public Pages | apps/public/presentation/pages/ | NamePage |

---

## Basic Component

```typescript
'use client';

import { useCallback } from 'react';
import { Container, Title } from './UserCard.styled';
import type { UserCardProps } from './UserCard.interfaces';

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(user.id);
  }, [onSelect, user.id]);

  return (
    <Container onClick={handleClick}>
      <Title>{user.name}</Title>
    </Container>
  );
};
```

---

## Styled File

```typescript
'use client';

import styled from 'styled-components';
import { colorsFlatMap, spacingFlatMap } from '@theme';

export const Container = styled.div`
  background-color: ${colorsFlatMap.white};
  padding: ${spacingFlatMap.md};
`;

export const Title = styled.h2`
  color: ${colorsFlatMap.textPrimary};
  font-size: 1.5rem;
`;
```

**Why Flat Maps**: Theme context crashes SSR. Flat maps are plain objects that work everywhere.

---

## Transient Props

```typescript
// ✅ No DOM warning
<Badge $variant="primary" $isActive={true}>Text</Badge>

// Styled component
const Badge = styled.span<{ $variant: string; $isActive: boolean }>`
  background: ${({ $variant }) => $variant === 'primary' ? 'blue' : 'gray'};
`;
```

**Why $-prefix**: Styled-components filters $-prefixed props from DOM, preventing React warnings.

---

## Render Functions

```typescript
export const DataTable = ({ items, onEdit }) => {
  // ✅ Inside component (has access to props/hooks)
  const renderRow = (item) => (
    <Row key={item.id} onClick={() => onEdit(item)}>
      {item.name}
    </Row>
  );

  return <Table>{items.map(renderRow)}</Table>;
};
```

**Rule**: Render functions MUST be inside component body, never exported.

---

## Index File

```typescript
export * from './ComponentName';
export type * from './ComponentName.interfaces';
```

**Why**: Named exports for tree-shaking. Never default exports.

---

## Related

- `frontend/presentation/hooks.md` - Custom hooks
- `frontend/presentation/styling/styled-components.md` - Styling patterns

