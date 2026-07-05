# Presentation Layer

> **Layer**: Presentation (outermost)
> **Dependencies**: Infrastructure (via hooks)
> **Principle**: Pure UI, no business logic

---

## Structure

```
presentation/
├── index.md
├── components.md        # Component structure, composition
├── component-types.md   # View, Update, Container patterns
├── hooks.md             # Custom hooks
├── layouts.md           # Layout patterns, children stability
├── forms.md             # Form handling, validation
├── sovereignty-ui-integration.md  # sovereignty-ui library consumption
├── atomic-colocation.md     # Atomic colocation pattern
└── styling/
    ├── index.md
    ├── styled-components.md
    ├── design-tokens.md
    └── responsive.md
```

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `components.md` | 5-file structure, composition |
| `component-types.md` | View, Update, Container classification |
| `hooks.md` | Custom hooks, hook composition |
| `layouts.md` | Stable children, single return |
| `forms.md` | Validation, field limits |
| `styling/styled-components.md` | SSR-safe patterns |
| `styling/design-tokens.md` | Colors, spacing, typography |
| `styling/responsive.md` | Breakpoints, grids |
| `sovereignty-ui-integration.md` | Library installation, token overrides, wrapper pattern |
| `atomic-colocation.md` | Keep code colocated with its only consumer — promote only when a second appears |

---

## TL;DR

**Presentation = Pure UI. Delegate logic to hooks/services.**

```typescript
// ✅ Component - pure presentation
const UserCard = ({ user, onEdit }: UserCardProps) => (
  <Card>
    <UserName>{user.name}</UserName>
    <EditButton onClick={() => onEdit(user.id)}>Edit</EditButton>
  </Card>
);

// ✅ Hook - encapsulates logic
const useUserCard = (userId: string) => {
  const user = useAppSelector(selectUserById(userId));
  const dispatch = useAppDispatch();

  const handleEdit = (id: string) => {
    dispatch(openEditModal(id));
  };

  return { user, handleEdit };
};

// ❌ NEVER in components
const user = await fetch('/api/users/1');  // Direct API call!
const result = calculateBusinessLogic();    // Business logic!
```

---

## Layer Rules

1. **No direct API calls** - Use Redux thunks
2. **No business logic** - Delegate to use cases
3. **Styled-components only** - No native HTML
4. **Design tokens only** - No hardcoded values

---

## When to Consult

- Creating component → `components.md`
- Deciding component type → `component-types.md`
- Creating hook → `hooks.md`
- Layout with children → `layouts.md`
- Form validation → `forms.md`
- sovereignty-ui library → `sovereignty-ui-integration.md`
- Styling → `styling/`

---

**Sovereignty**: Presentation displays, never decides.
