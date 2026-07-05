# File Modularization

> **Module**: core/architecture
> **ESLint**: `custom/max-lines-per-file`, `custom/max-lines-per-function`

---

## TL;DR

**DO**:
- Function: 50 lines max
- File: 350 lines max (250 for styled)
- JSX section: 50 lines max → render function
- Business logic >150 lines → custom hook
- Each component owns its styles

**DON'T**:
- Components >350 lines without extraction
- Shared styled files (distribute to components)
- Multiple responsibilities without splitting
- Mocks/tests follow size limits (accuracy > size)

---

## Size Limits

| Type | Limit | Action if Exceeded |
|------|-------|-------------------|
| Function | 50 lines | Extract sub-functions |
| File | 350 lines | Extract components |
| Styled | 250 lines | Distribute to children |
| JSX section | 50 lines | Render function |
| Business logic | 150 lines | Custom hook |

**Exempt**: Tests, mocks, seeds, scripts.

---

## Extraction Triggers

| Trigger | Action |
|---------|--------|
| Component >350 lines | Extract sub-components |
| Styled >250 lines | Distribute to components |
| Function >50 lines | Extract helper |
| JSX >50 lines | Render function → component |
| Screen 4+ sections | Componentize each |
| Multiple responsibilities | Split by responsibility |

---

## Component Extraction

```
// BEFORE: UserProfile.tsx (450 lines)

// AFTER:
UserProfile/
├── UserProfile.tsx (100 lines) - Container
├── UserProfileHeader.tsx (80 lines)
├── UserProfileStats.tsx (60 lines)
├── UserProfileActivity.tsx (120 lines)
└── index.ts
```

---

## Styled Distribution

```typescript
// ❌ WRONG - Shared styled (400 lines)
// UserProfile.styled.ts
export const Container = styled.div`...`;
export const Header = styled.header`...`;  // Should be in Header.styled.ts

// ✅ CORRECT - Distributed
// UserProfile.styled.ts (60 lines) - Container only
export const ProfileContainer = styled.div`...`;

// UserProfileHeader.styled.ts (50 lines) - Own styles
export const HeaderContainer = styled.header`...`;
```

---

## Render Functions

```typescript
const UserProfile = () => {
  // ✅ Extract JSX sections >50 lines
  const renderHeader = () => (
    <Header>{/* 40 lines */}</Header>
  );

  const renderStats = () => (
    <Stats>{/* 30 lines */}</Stats>
  );

  return (
    <Container>
      {renderHeader()}
      {renderStats()}
    </Container>
  );
};
```

---

## Business Logic Extraction

| Logic Type | Location |
|------------|----------|
| Component state | useState in component |
| Component logic (>150 lines) | hooks/ folder |
| Shared utility | @helpers |
| Domain logic | use-cases/ |

```typescript
// Extract to hook when >150 lines
export const useUserProfile = (userId: string) => {
  const [user, setUser] = useState(null);
  // 180 lines of logic

  return { user, handleFollow, handleMessage };
};
```

---

## Validation

```bash
yarn type-check    # 0 errors
yarn lint          # 0 errors, 0 warnings
yarn test          # All passing
yarn build         # Success
```

---

## Related

- `core/quality/code-size-limits.md` - Size philosophy
- `frontend/presentation/components.md` - Component structure

