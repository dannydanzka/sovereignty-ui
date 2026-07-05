# Use Cases

> **Module**: frontend/domain
> **ESLint**: `custom/use-case-policy`

---

## TL;DR

**DO**:
- Arrow function: `export const executeX = async ()`
- Discriminated unions: `{ success: true } | { success: false }`
- validateAndGetUser() for protected operations
- Validate inputs BEFORE repository calls
- Spanish error messages

**DON'T**:
- HTTP/NextResponse/Request (belongs in routes)
- Direct database calls (use repositories)
- Classes or constructors
- Business logic elsewhere

---

## Use Case Responsibility

| CAN DO | CANNOT DO |
|--------|-----------|
| Input validation | HTTP transport |
| Authorization (RBAC) | Framework dependencies |
| Business logic | Direct database access |
| Repository calls | UI concerns |
| Activity logging | |

---

## Use Case Flow

```
1. Validate inputs (structure, format, rules)
   ↓
2. Authorize (validateAndGetUser if protected)
   ↓
3. Check business rules (RBAC, ownership)
   ↓
4. Call repository
   ↓
5. Log activity (if mutation)
   ↓
6. Return discriminated union
```

---

## Basic Use Case

```typescript
import { validateAndGetUser, createValidationError, handleUseCaseError } from '@helpers';
import { USER_ROLES } from '@constants';
import { userRepository } from '@repositories';

export const executeCreateUser = async (params: CreateUserParams): Promise<CreateUserResponse> => {
  try {
    // 1. Validate
    if (!params.email || !params.firstName) {
      return createValidationError('Faltan campos obligatorios', 'email');
    }

    // 2. Auth
    const authResult = await validateAndGetUser(params.request, [USER_ROLES.ADMIN]);
    if (!authResult.success) {
      return authResult.error;
    }

    // 3. Business rules
    const existing = await userRepository.findByEmail(params.email);
    if (existing) {
      return createValidationError('Ya existe un usuario con este email', 'email');
    }

    // 4. Repository
    const newUser = await userRepository.create({
      email: params.email,
      firstName: params.firstName,
      // ...
    });

    // 5. Success
    return {
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente',
    };
  } catch (error) {
    return handleUseCaseError(error, 'executeCreateUser');
  }
};
```

---

## Validation Pattern

```typescript
// Private validators return ValidationResult | null
const validateEmail = (email: string): ValidationResult | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Formato de email no válido',
      context: { field: 'email', value: email },
    };
  }
  return null;  // Valid
};

// Composed validation with early return
const validateInput = (params: Params): ValidationResult => {
  const emailError = validateEmail(params.email);
  if (emailError) return emailError;

  const passwordError = validatePassword(params.password);
  if (passwordError) return passwordError;

  return { isValid: true };
};
```

---

## Discriminated Union Response

```typescript
type CreateUserResponse =
  | { success: true; data: UserEntity; message: string }
  | { success: false; error: string; status?: number };

// Usage - TypeScript narrows automatically
const result = await executeCreateUser(params);
if (result.success) {
  console.log(result.data);  // UserEntity
} else {
  console.log(result.error); // string
}
```

---

## File Structure

```
use-cases/create-user/
├── create-user.use-case.ts
├── create-user.interfaces.ts
├── create-user.use-case.test.ts
└── index.ts
```

```typescript
// index.ts
export type * from './create-user.interfaces';
export * from './create-user.use-case';
```

---

## Why Arrow Functions

- No `this` binding issues
- Tree-shaking friendly
- Stateless (pure functions)
- Consistent with routes/services

---

## Related

- `frontend/nextjs/api-routes.md` - Route delegation
- `frontend/infrastructure/repositories.md` - Repository calls

