# Form Validation Pattern (Zod + react-hook-form)

> **Priority**: HIGH - ALL forms MUST use this pattern
> **ESLint Enforcement**: `custom/enforce-zod-forms` ⚡
> **Scope**: All projects with forms
> **Purpose**: Standardize form validation with Zod schemas + react-hook-form

---

## Core Principle

```
ALL forms MUST use:
  1. Zod schema in a .validation.ts file
  2. react-hook-form with zodResolver
  3. Field-level errors from formState.errors
  4. Toasts for API results (NOT inline alerts)
```

**NEVER use**: `useState<FormData>`, manual `validateForm()`, `useState<FormErrors>`

---

## File Structure

Every form needs a `.validation.ts` file alongside its component or hook:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.validation.ts    # Zod schema
├── ComponentName.interfaces.ts    # z.infer<typeof schema> type
├── ComponentName.styled.ts
└── index.ts
```

---

## Standard Pattern

### 1. Validation Schema (.validation.ts)

```typescript
import { z } from 'zod';

export const myFormSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Correo inválido'),
  firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(50, 'Máximo 50 caracteres'),
  age: z.number().min(1).max(120).optional(),
});
```

### 2. Type from Schema (.interfaces.ts)

```typescript
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

import type { myFormSchema } from './MyForm.validation';

export type MyFormData = z.infer<typeof myFormSchema>;

export interface MyFormModalProps {
  myForm: UseFormReturn<MyFormData>;
  isSaving: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
}
```

### 3. Hook (useMyFormModal.ts)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { MyFormData } from './MyForm.interfaces';
import { myFormSchema } from './MyForm.validation';

const INITIAL_FORM: MyFormData = { email: '', firstName: '', lastName: '' };

export const useMyFormModal = () => {
  const myForm = useForm<MyFormData>({
    defaultValues: INITIAL_FORM,
    mode: 'onBlur',
    resolver: zodResolver(myFormSchema),
  });

  const handleSave = useCallback(async () => {
    const isValid = await myForm.trigger();
    if (!isValid) return;

    const formData = myForm.getValues();
    // ... API call
  }, [myForm]);

  const handleOpen = useCallback(() => {
    myForm.reset(INITIAL_FORM);
    setIsOpen(true);
  }, [myForm]);

  return { handleSave, myForm };
};
```

### 4. Component (watch/setValue pattern)

```typescript
export const MyFormModal = ({ myForm, isSaving, onSave }: MyFormModalProps) => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = myForm;

  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue('firstName', e.target.value),
    [setValue]
  );

  return (
    <>
      <AdminFormInput value={firstName} onChange={handleFirstNameChange} />
      {errors.firstName && <AdminFormError>{errors.firstName.message}</AdminFormError>}
    </>
  );
};
```

**Why watch/setValue?** AdminFormInput and similar styled inputs don't forward refs, so `register()` spread doesn't work. Use `watch()` for values and `setValue()` for updates.

---

## Feedback Type Decision Matrix

| Scenario | Feedback Type | Example |
|----------|--------------|---------|
| **Form validation error** | Inline (field-level) | `{errors.name && <AdminFormError>{errors.name.message}</AdminFormError>}` |
| **API success** | Toast | `showSuccess('Guardado correctamente')` |
| **API error** | Toast OR form.setError | `form.setError('name', { message: errorMsg })` |
| **Conditional validation** | form.setError() | Business logic not expressible in Zod schema |

---

## Conditional Validation

For business logic that Zod can't express statically, use `form.setError()` after `trigger()`:

```typescript
const handleSave = useCallback(async () => {
  const isValid = await form.trigger();
  if (!isValid) return;

  const data = form.getValues();

  // Conditional business rule
  if (data.paymentType === 'OTHER' && !data.platformName) {
    form.setError('platformName', { message: 'Indica el nombre de la plataforma' });
    return;
  }

  // ... proceed with API call
}, [form]);
```

---

## Server Error Handling

Route server errors to a relevant field via `setError`:

```typescript
try {
  await apiCall(data);
  showSuccess('Guardado');
} catch (err) {
  form.setError('firstName', {
    message: err instanceof Error ? err.message : 'Error al guardar',
  });
}
```

---

## Edit Mode (Populate Form)

```typescript
const handleEdit = useCallback((entity: Entity) => {
  form.reset({
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
  });
  setIsEditing(true);
}, [form]);
```

---

## Notification Hook API

```typescript
const { showSuccess, showError, showWarning } = useNotifications();

showSuccess('Guardado correctamente');     // Green toast, auto-dismiss
showError('Error al guardar');             // Red toast, auto-dismiss
showWarning('Acción irreversible');        // Orange toast, auto-dismiss
```

---

## Anti-Patterns

### DON'T: Manual form state

```typescript
// ❌ BAD — ESLint: custom/enforce-zod-forms
const [formData, setFormData] = useState<MyFormData>({...});
const [formError, setFormError] = useState<string | null>(null);

const validateForm = () => {
  if (!formData.name) { setFormError('Nombre requerido'); return false; }
  return true;
};

// ✅ GOOD
const form = useForm<MyFormData>({ resolver: zodResolver(schema) });
const isValid = await form.trigger();
```

### DON'T: Toast for field validation

```typescript
// ❌ BAD
if (!formData.email) { showError('Email es requerido'); return; }

// ✅ GOOD — Zod handles it via field-level errors
```

### DON'T: Inline alerts for API results

```typescript
// ❌ BAD
{isSuccess && <SuccessMessage>Guardado</SuccessMessage>}
{error && <ErrorMessage>{error}</ErrorMessage>}

// ✅ GOOD
showSuccess('Guardado correctamente');
showError(error.message);
```

---

## Migration Checklist

When migrating existing forms:

1. **Create** `.validation.ts` with Zod schema
2. **Update** `.interfaces.ts` — `z.infer<typeof schema>`, `UseFormReturn<FormData>` in props
3. **Replace** `useState<FormData>` with `useForm<FormData>({ resolver: zodResolver(schema) })`
4. **Remove** `formError`, `setFormError`, `handleFormChange`, `validateForm`
5. **Update** component — `watch()`/`setValue()` pattern, field-level `errors.field.message`
6. **Update** parent — pass `form` prop instead of `formData`/`formError`/`handleFormChange`
7. **Remove** dead code — `INITIAL_FORM_DATA` (if moved to hook), old interfaces, validators
8. **Lint** — verify 0 warnings
9. **Type-check** — verify 0 errors
10. **Test** — update test mocks (`as never` pattern for UseFormReturn mock)

---

## Test Mock Pattern

```typescript
const mockForm = {
  clearErrors: vi.fn(),
  control: {} as never,
  formState: { errors: {}, isDirty: false, isSubmitting: false, isValid: true },
  getValues: vi.fn(() => ({ /* all fields */ })),
  handleSubmit: vi.fn(),
  register: vi.fn(),
  reset: vi.fn(),
  setError: vi.fn(),
  setValue: vi.fn(),
  trigger: vi.fn(),
  watch: vi.fn(() => ''),
} as never;
```

---

## Related Documentation

- `frontend/presentation/hooks.md` - Hook patterns
- `frontend/presentation/notifications.md` - Notification patterns
- `frontend/presentation/styling/design-tokens.md` - Token reference

---

**Version**: 2.0 | **Updated**: 2026-03-10
