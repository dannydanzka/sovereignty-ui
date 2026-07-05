# Notification Patterns

> **Purpose**: Centralized notification handling via Redux thunks
> **Scope**: All async operations (CRUD, state transitions, etc.)
> **Philosophy**: Single source of truth - thunks own notifications

---

## Core Principle

**Thunks handle ALL notifications for async operations**. Components/hooks NEVER duplicate.

```
┌─────────────────────────────────────────────────────────────┐
│                    NOTIFICATION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Component/Hook                                              │
│       │                                                      │
│       ▼                                                      │
│  dispatch(thunk)  ──────────────────────────────────────┐    │
│       │                                                 │    │
│       │                                                 ▼    │
│       │                                         ┌────────────┤
│       │                                         │ Thunk      │
│       │                                         │ handles:   │
│       │                                         │ • Success  │
│       │                                         │ • Error    │
│       │                                         │ • Loading  │
│       │                                         └────────────┤
│       ▼                                                      │
│  Handle local state ONLY                                     │
│  (close modal, reset form, etc.)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## createManagedThunk Configuration

```typescript
// ✅ CORRECT: Thunk handles notifications
export const createUser = createManagedThunk<UserEntity, CreateUserPayload>({
  actionName: 'users/createUser',
  customErrorMessage: 'Error al crear usuario',
  operation: async (payload) => UsersService.create(payload),
  showSuccessNotification: true,
  successMessage: (result) => `Usuario "${result.firstName}" creado correctamente`,
  // showErrorNotification: true (default)
});

// ❌ WRONG: Missing notification config
export const createUser = createManagedThunk<UserEntity, CreateUserPayload>({
  actionName: 'users/createUser',
  operation: async (payload) => UsersService.create(payload),
  // No showSuccessNotification = no success toast
});
```

### Configuration Options

| Option | Default | Purpose |
|--------|---------|---------|
| `showSuccessNotification` | `false` | Show toast on success |
| `successMessage` | - | Message or function `(result) => string` |
| `showErrorNotification` | `true` | Show toast on error |
| `customErrorMessage` | - | Fallback error message |

---

## Hook Pattern (DO)

```typescript
// ✅ CORRECT: Hook only handles local state
const handleSaveUser = useCallback(async () => {
  // Local validation (OK to show error here - not from thunk)
  if (!formData.name.trim()) {
    showError('El nombre es requerido');
    return;
  }

  setIsSaving(true);
  try {
    const result = await createUser(formData);
    if (!result.success) return; // Thunk already showed error

    handleCloseModal();
    loadUsers();
  } catch (err) {
    logError(err, 'handleSaveUser');
    // NO showError here - thunk already showed it
  } finally {
    setIsSaving(false);
  }
}, [createUser, formData, handleCloseModal, loadUsers]);
```

---

## Hook Pattern (DON'T)

```typescript
// ❌ WRONG: Duplicate notifications
const handleSaveUser = useCallback(async () => {
  try {
    const result = await createUser(formData);
    if (!result.success) {
      showError(result.error); // DUPLICATE - thunk already showed this
      return;
    }
    showSuccess('Usuario creado'); // DUPLICATE - thunk already showed this
    handleCloseModal();
  } catch (err) {
    showError('Error al guardar'); // DUPLICATE - thunk already showed this
  }
}, [createUser, formData, showError, showSuccess]);
```

---

## When Manual Notifications ARE Appropriate

### 1. Local Validation (Before Thunk Call)

```typescript
// ✅ OK: Validation happens BEFORE thunk is called
if (!formData.email.includes('@')) {
  showError('Email inválido');
  return;
}
await createUser(formData); // Thunk handles its own errors
```

### 2. Non-Thunk Operations (Should Be Rare)

```typescript
// ⚠️ AVOID: Direct service calls should use thunks instead
// If unavoidable, manual notification is required
try {
  await SomeService.directCall();
  showSuccess('Operación completada');
} catch {
  showError('Error en operación');
}
```

**Note**: Direct service calls from components violate architecture rules. Use thunks instead.

---

## Notification Types

| Type | Use Case | Duration |
|------|----------|----------|
| `success` | CRUD completed, status changed | 3000ms |
| `error` | Operation failed, validation error | 5000ms |
| `warning` | Soft warnings, confirmations | 4000ms |
| `info` | Informational messages | 3000ms |

---

## Migration Checklist

When adding notifications to existing thunks:

1. **Add to slice**:
   ```typescript
   showSuccessNotification: true,
   successMessage: (result) => `${result.name} creado correctamente`,
   ```

2. **Remove from hook**:
   - Remove `showSuccess()` after successful operation
   - Remove `showError()` in catch blocks
   - Keep `showError()` for local validation only

3. **Clean dependencies**:
   - Remove `showSuccess`/`showError` from useCallback deps if no longer used
   - Remove `useNotifications()` import if no longer needed

---

## Quick Reference

| Scenario | showSuccess | showError |
|----------|-------------|-----------|
| After `await thunk()` success | ❌ Thunk | ❌ Thunk |
| In catch after `await thunk()` | - | ❌ Thunk |
| Local validation (before thunk) | - | ✅ Manual |
| Direct service call (avoid) | ✅ Manual | ✅ Manual |

---

## Related Documentation

- `.claude/patterns/redux-patterns.md` - Redux architecture
- `.claude/patterns/error-handling-patterns.md` - Error handling
- `.claude/patterns/core/REDUX-STANDARDS.md` - Redux standards

---

**Version**: 1.0 | **Created**: 2026-01-30
