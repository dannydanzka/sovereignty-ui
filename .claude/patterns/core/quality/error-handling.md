# Error Handling

> **Module**: core/quality
> **ESLint**: `custom/no-try-catch-abuse`
> **Updated**: 2026-05-02
> **Version**: 3.0
> **Status snapshot**: `.claude/status/operations/error-handling.md`

---

## Architecture

All error handling lives under `src/libs/shared/helpers/error-handling/` with **dedicated aliases** (no barrel re-exports):

```
error-handling/
├── app-error/           → @app-error    (AppError class + createAppError factory)
├── api-error-handler/   → @api-error    (handleApiError, createErrorResponse)
├── use-case-error-handler/ → @use-case-error (handleUseCaseError, create*Error factories)
├── prisma-errors/       → (internal)    (translatePrismaError - shared by api + use-case)
├── error-provider/      → @error-provider (client-side error boundary utilities)
└── logger/              → @logger       (logger, logError, logInfo, logWarning)
```

**Import rules**:
- NEVER import error handling from `@helpers` — use the dedicated alias
- Each module has ONE responsibility and ONE alias
- `prisma-errors/` is internal only (consumed by api-error-handler and use-case-error-handler)

---

## Layer-Specific Handlers

| Layer | Handler | Alias | Returns | Used By |
|-------|---------|-------|---------|---------|
| **API Routes** | `handleApiError()` | `@api-error` | `NextResponse` (JSON) | ~60 API routes |
| **Use Cases** | `handleUseCaseError()` | `@use-case-error` | `{ success: false, error, status }` | ~80 use cases |
| **Redux Thunks** | `createManagedThunk` | `@thunks` | `rejectWithValue` (built-in) | ~35 thunks |
| **Components** | `setError()` / state | — | UI state update | Hooks |
| **Client Boundary** | `ErrorProvider` | `@error-provider` | Error categorization + UI | App root |

---

## Import Patterns

```typescript
/** API Route */
import { handleApiError } from '@api-error';

/** Use Case */
import { createNotFoundError, handleUseCaseError } from '@use-case-error';

/** Logging */
import { logError, logInfo } from '@logger';

/** AppError (rare — only thunkHandler and error handlers use it directly) */
import { AppError, createAppError } from '@app-error';

/** Client-side error boundary */
import { categorizeError, createErrorInfo } from '@error-provider';
```

---

## Use Case Pattern

```typescript
import { createValidator, validateAndGetUser } from '@helpers';
import { HTTP_STATUS, USER_ROLES } from '@constants';
import { handleUseCaseError } from '@use-case-error';
import type { UseCaseErrorResponse } from '@use-case-error';

export const executeCreateKit = async (params: CreateKitParams): Promise<CreateKitResponse> => {
  try {
    const validator = createValidator<CreateKitParams>();
    const validate = validator.compose(
      validator.required('name'),
      validator.required('description'),
    );
    const validationError = validate(params);
    if (validationError) return validationError;

    const authResult = await validateAndGetUser<CreateKitResponse>(params.request, [
      USER_ROLES.ADMIN,
      USER_ROLES.OWNER,
    ]);
    if (!authResult.success) return authResult.error;

    const newKit = await kitRepository.create({ ... });
    return { data: { kit: newKit }, status: HTTP_STATUS.CREATED, success: true };
  } catch (error) {
    return handleUseCaseError<UseCaseErrorResponse>(error, 'executeCreateKit');
  }
};
```

---

## API Route Pattern

```typescript
import { handleApiError } from '@api-error';
import { HTTP_STATUS } from '@constants';
import { withAuthMiddleware } from '@middleware';

export const POST = withAuthMiddleware(
  async (request: NextRequest) => {
    try {
      const body = await request.json();
      const result = await executeCreateKit({ ...body, request });
      return NextResponse.json(result, {
        status: result.success ? HTTP_STATUS.CREATED : HTTP_STATUS.BAD_REQUEST,
      });
    } catch (error) {
      return handleApiError(error, 'POST /api/admin/kits');
    }
  },
  ['admin', 'owner']
);
```

---

## Error Factories (Use Cases)

All factories return `{ success: false, error, status }` discriminated union:

```typescript
import {
  createAuthorizationError,
  createBusinessLogicError,
  createNotFoundError,
  createValidationError,
} from '@use-case-error';

/** Validation failure (400) */
createValidationError('El email es requerido', 'email');

/** Resource not found (404) */
createNotFoundError('Usuario', userId);

/** Permission denied (401) */
createAuthorizationError('Acceso denegado', 'Solo el owner puede realizar esta acción');

/** Business rule violation (422) */
createBusinessLogicError(
  'No se puede eliminar un evento activo',
  'EVENT_ACTIVE',
  { eventId }
);
```

---

## AppError Class

```typescript
import { AppError, createAppError } from '@app-error';

/** Factory pattern (preferred in use cases) */
throw createAppError({ code: 'VALIDATION_ERROR', field: 'email' }, 'Email inválido');

/** Direct instantiation (only in error handlers and thunks) */
throw new AppError(errorData, errorMessage);
```

**Properties**:
- `content: T` — Typed error payload (HTTP response data, validation details, etc.)
- `message: string` — Human-readable error message
- Extends `Error` (throwable, catchable with `instanceof`)

---

## handleRequest Error Priority

`customDefaultErrorMessage` is a **fallback**, NOT an override. Server error always wins.

```typescript
// Priority (handleRequest.ts, post-fix 2026-05-02):
if (typeof errorData === 'object' && errorData) {
  errorMessage = data.error                               // ← server wins always
    ? String(data.error)
    : customDefaultErrorMessage || HTTP_CONSTANTS.DEFAULT_ERROR_MESSAGE;
} else {
  errorMessage = customDefaultErrorMessage || HTTP_CONSTANTS.DEFAULT_ERROR_MESSAGE;
}
```

**When to use `customDefaultErrorMessage` in services**:
- Use it to provide context on network/timeout failures where the server has no body
- Example: `customDefaultErrorMessage: 'No se pudo crear el usuario'` shows when there is NO server error (network down, CORS, empty 500)
- If the server returns `{ error: "El correo ya está en uso" }`, that message is shown instead

**DO NOT** expect `customDefaultErrorMessage` to override or mask a server error — it will not.

---

## createManagedThunk — `customErrorMessage` is dead code

```typescript
// DO NOT USE — never reached in practice:
createManagedThunk({
  customErrorMessage: 'Error al crear usuario',  // ❌ dead code
  operation: async (data) => { ... },
})

// CORRECT — no customErrorMessage needed:
createManagedThunk({
  operation: async (data) => { ... },
})
```

**Why it's unreachable**: `handleRequest` always throws `AppError`. Inside `getErrorMessage`, `error instanceof AppError` is always true → returns `error.message` (the real server error). The `customErrorMessage` branch only triggers for non-AppError, non-Error throws — which don't happen in this codebase.

---

## Prisma Error Translation

Shared translation used by both `handleApiError` and `handleUseCaseError`:

| Prisma Pattern | Spanish Message |
|----------------|-----------------|
| `too long for the column` | El contenido enviado excede el tamaño máximo permitido |
| `Unique constraint (email)` | Ya existe un registro con este correo electrónico |
| `Unique constraint (slug)` | Ya existe un registro con este identificador |
| `Unique constraint (other)` | Ya existe un registro con estos datos |
| `Record to update not found / P2025` | El registro que intentas modificar ya no existe |
| `Foreign key constraint / P2003` | No se puede completar la operación porque hay registros relacionados |
| `Invalid invocation` | Error al procesar los datos |

---

## Logger

```typescript
import { logError, logInfo, logWarning } from '@logger';

logError(error, 'executeCreateKit');     // Always logged (dev + prod)
logWarning('Missing field', 'context');  // Always logged (dev + prod)
logInfo('Payment processed', 'webhook'); // Development only
```

---

## Hook Pattern (component layer)

Thunks dispatch error notifications automatically. Hooks catch only for flow control:

```typescript
// CORRECT — hook only needs success/failure, notification already dispatched by thunk:
const result = await createUser(data);
if (!result.success) return;  // stop, modal stays open; user already sees toast
handleCloseModal();

// WRONG — duplicate notification:
const result = await createUser(data);
if (!result.success) {
  showError(result.error);  // ❌ thunk already showed this
  return;
}
```

---

## Try-Catch Rules

**Valid uses**:
- API routes: unexpected errors → JSON response
- Use cases: repository failures → discriminated union
- Components: async failures → UI flow control (NOT user-facing messages)

**Invalid uses**:
```typescript
/** NEVER: Try-catch for validation */
try {
  if (!email) throw new Error('Required');
} catch (e) { ... }

/** DO: Direct validation */
if (!email) {
  return createValidationError('Email es requerido', 'email');
}

/** NEVER: Silent catch */
try { ... } catch (e) { /* nothing */ }

/** DO: Always handle */
try { ... } catch (error) {
  return handleUseCaseError(error, 'context');
}
```

---

## Error Flow Summary

```
Component → Hook → Redux Thunk → Service → handleRequest
                                              ↓ (HTTP error)
                                   parse server body → data.error (or fallback)
                                              ↓
                                       AppError thrown
                                              ↓
                                     thunk catch: getErrorMessage
                                              ↓
                                   dispatchErrorNotification (toast)
                                              ↓
                                   rejectWithValue({ message, details })
                                              ↓
                                   Hook: result.success = false → stop
                                              ↓
                                   Component: modal stays open

API Route → Use Case → Repository → Prisma
                          ↓ (Prisma error)
                    handleUseCaseError catches
                          ↓
                    translatePrismaError → Spanish message
                          ↓
                    { success: false, error: "mensaje", status: 400 }
                          ↓
                    API Route returns NextResponse.json(result)
```

---

## Alias Configuration

Both `tsconfig.json` and `vitest.config.ts` MUST define these aliases:

| Alias | Path |
|-------|------|
| `@app-error` | `src/libs/shared/helpers/error-handling/app-error` |
| `@api-error` | `src/libs/shared/helpers/error-handling/api-error-handler` |
| `@use-case-error` | `src/libs/shared/helpers/error-handling/use-case-error-handler` |
| `@error-provider` | `src/libs/shared/helpers/error-handling/error-provider` |
| `@logger` | `src/libs/shared/helpers/error-handling/logger` |

---

## Anti-Patterns

### customErrorMessage in thunks (dead code)

```typescript
/** NEVER: customErrorMessage is never reached — remove it */
createManagedThunk({
  customErrorMessage: 'Error al actualizar',  // ❌ dead code
  operation: ...
})

/** DO: omit it */
createManagedThunk({
  operation: ...
})
```

### Dual-Alias Imports (Symbol accessible from two paths)

When a module has a dedicated alias, it MUST NOT also be re-exported from a parent barrel:

```typescript
/** NEVER: Same symbol from two aliases */
import { createManagedThunk } from '@helpers';  // ❌ Via barrel re-export
import { createManagedThunk } from '@thunks';   // ✅ Dedicated alias

/** NEVER: Error symbols from @helpers */
import { handleApiError } from '@helpers';       // ❌ Via barrel re-export
import { handleApiError } from '@api-error';     // ✅ Dedicated alias
```

---

## Related

- `core/quality/type-safety.md` — Discriminated unions
- `frontend/domain/use-cases.md` — Use case patterns
- `frontend/nextjs/api-routes.md` — API error handling
- `frontend/infrastructure/database/prisma.md` — Prisma error codes
- `.claude/status/operations/error-handling.md` — Runtime status snapshot
